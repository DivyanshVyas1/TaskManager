import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import HeaderManager from '../components/HeaderManager';

const Dashboard = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/tasks');
      setTasks(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHeaders = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/headers');
      setHeaders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHeaders();
      fetchTasks();
    }
  }, [user]);

  if (loading || !user) return <div className="text-center mt-10">Loading...</div>;

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    percent: tasks.length === 0 ? 0 : Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
  };

  return (
    <div className="container py-8 fade-in min-h-screen">
      <header className="flex justify-between items-center" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Hello, {user?.username}</h1>
          <p className="text-muted">Welcome to your ultimate life tracker.</p>
        </div>
        <button className="btn btn-outline" onClick={logout}>Logout</button>
      </header>

      <div className="dashboard-grid" style={{ display: 'grid', gap: '2rem' }}>
        <main>
          {/* Progress Overview */}
          <div className="glass-panel p-6 mb-6" style={{ padding: '1.5rem' }}>
            <h2 className="text-xl mb-4 font-semibold">Overall Progress</h2>
            <div className="flex items-center gap-4">
              <div style={{ flex: 1, background: 'var(--bg-tertiary)', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${stats.percent}%`, background: 'var(--success)', height: '100%', transition: 'width 0.5s ease' }}></div>
              </div>
              <span className="font-bold">{stats.percent}% Achieved</span>
            </div>
            <p className="text-muted mt-2 text-sm">{stats.completed} of {stats.total} items completed</p>
          </div>

          <HeaderManager fetchHeaders={fetchHeaders} headers={headers} />
          <TaskForm fetchTasks={fetchTasks} headers={headers} />
          
          <div className="mt-8">
            <TaskList tasks={tasks} fetchTasks={fetchTasks} headers={headers} />
          </div>
        </main>
      </div>
      
      <style>{`
        .container {
          padding-left: 5%;
          padding-right: 5%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .dashboard-grid {
          grid-template-columns: 1fr;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
