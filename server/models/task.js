const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Apply auth middleware to all routes
router.use(auth);

// GET all tasks for logged-in user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId })
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching tasks', 
      error: error.message 
    });
  }
});

// GET single task by ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id,
      userId: req.user.userId 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching task', 
      error: error.message 
    });
  }
});

// CREATE new task
router.post('/', async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;

    // Validate required fields
    if (!name || !description || !dueDate) {
      return res.status(400).json({ 
        message: 'Please provide name, description, and due date' 
      });
    }

    const task = new Task({
      name,
      description,
      dueDate,
      userId: req.user.userId
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating task', 
      error: error.message 
    });
  }
});

// UPDATE task
router.put('/:id', async (req, res) => {
  try {
    const { name, description, dueDate } = req.body;

    // Validate required fields
    if (!name || !description || !dueDate) {
      return res.status(400).json({ 
        message: 'Please provide name, description, and due date' 
      });
    }

    const task = await Task.findOne({ 
      _id: req.params.id,
      userId: req.user.userId 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task fields
    task.name = name;
    task.description = description;
    task.dueDate = dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating task', 
      error: error.message 
    });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.user.userId 
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting task', 
      error: error.message 
    });
  }
});

// GET tasks by date range
router.get('/filter/date', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Please provide start and end dates' 
      });
    }

    const tasks = await Task.find({
      userId: req.user.userId,
      dueDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error filtering tasks', 
      error: error.message 
    });
  }
});

// Search tasks
router.get('/search/:query', async (req, res) => {
  try {
    const searchQuery = req.params.query;
    const tasks = await Task.find({
      userId: req.user.userId,
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error searching tasks', 
      error: error.message 
    });
  }
});

module.exports = router;