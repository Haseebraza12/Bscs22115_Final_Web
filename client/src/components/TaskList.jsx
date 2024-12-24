import { useState, useEffect } from 'react';
import api from '../utils/axios'; // Use the configured axios instance
import './components.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    dueDate: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view tasks');
        return;
      }

      const response = await api.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.response?.data?.message || 'Error fetching tasks');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to add tasks');
        return;
      }

      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, newTask, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setEditingTask(null);
      } else {
        await api.post('/tasks', newTask, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      setNewTask({ name: '', description: '', dueDate: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      setError(error.response?.data?.message || 'Error saving task');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to delete tasks');
        return;
      }

      await api.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error.response?.data?.message || 'Error deleting task');
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
          {error && <div className="error-message">{error}</div>}
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