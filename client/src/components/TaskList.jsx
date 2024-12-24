import { useState, useEffect } from 'react';
import axios from 'axios';
import './components.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    dueDate: ''
  });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await axios.put(`http://localhost:5000/api/tasks/${editingTask._id}`, newTask);
        setEditingTask(null);
      } else {
        await axios.post('http://localhost:5000/api/tasks', newTask);
      }
      setNewTask({ name: '', description: '', dueDate: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setNewTask({
      name: task.name,
      description: task.description,
      dueDate: task.dueDate.split('T')[0]
    });
  };

  return (
    <div className="container">
      <div className="task-container">
        <div className="task-header">
          <h2>Task List</h2>
        </div>
        
        <form className="task-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({...newTask, name: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            required
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
            required
          />
          <button 
            className="button submit-button" 
            type="submit"
          >
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
          {editingTask && (
            <button 
              className="button cancel-button" 
              type="button" 
              onClick={() => {
                setEditingTask(null);
                setNewTask({ name: '', description: '', dueDate: '' });
              }}
            >
              Cancel Edit
            </button>
          )}
        </form>

        <div className="task-list">
          {tasks.map((task) => (
            <div key={task._id} className="task-item">
              <h3>{task.name}</h3>
              <p>{task.description}</p>
              <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              <div className="task-actions">
                <button 
                  className="button edit-button"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>
                <button 
                  className="button delete-button"
                  onClick={() => handleDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TaskList;