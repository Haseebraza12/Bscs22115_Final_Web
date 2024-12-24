import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import TaskList from './components/TaskList';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <div className="app">
        {isAuthenticated && (
          <Navbar onLogout={handleLogout} />
        )}
        <main className="main-content">
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/tasks" />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              } 
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <TaskList />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/tasks" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;