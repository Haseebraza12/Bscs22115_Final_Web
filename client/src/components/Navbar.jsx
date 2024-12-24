import { useNavigate } from 'react-router-dom';
import './components.css';

function Navbar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Task Manager
      </div>
      <div className="navbar-menu">
        <button 
          className="navbar-button" 
          onClick={() => navigate('/tasks')}
        >
          Tasks
        </button>
        <button 
          className="navbar-button logout" 
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;