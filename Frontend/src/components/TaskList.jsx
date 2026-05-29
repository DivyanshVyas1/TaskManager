import React, { useState } from "react";
import axios from 'axios';

const TaskList = ({ tasks, fetchTasks, headers }) => {
  const [filter, setFilter] = useState("all");

  const handleComplete = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/tasks/${id}/complete`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Your Tracked Items</h3>
        <div className="flex gap-2">
          <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('all')}>All</button>
          <button className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('completed')}>Completed</button>
        </div>
      </div>

      {headers.length === 0 ? (
        <p className="text-center text-muted py-8">No items yet.</p>
      ) : (
        headers.map(header => {
          const headerTasks = filteredTasks.filter(t => t.headerId === header.id);
          if (headerTasks.length === 0) return null;

          return (
            <div key={header.id} style={{ marginBottom: '2.5rem' }}>
              <h4 className="text-lg font-bold mb-4 text-gradient border-b border-gray-700 pb-2" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                {header.name}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {headerTasks.map(task => (
                  <div key={task.id} className="glass-panel" style={{ padding: '1rem', background: task.completed ? 'rgba(16, 185, 129, 0.05)' : 'var(--glass-bg)', position: 'relative' }}>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px' }}
                      title="Delete Item"
                    >
                      &times;
                    </button>
                    <div className="flex justify-between items-start mb-2" style={{ paddingRight: '20px' }}>
                      <h5 style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>
                        {task.title}
                      </h5>
                      {!task.completed ? (
                        <button className="btn btn-outline" style={{ padding: '2px 6px', fontSize: '0.8rem', borderColor: 'var(--success)', color: 'var(--success)' }} onClick={() => handleComplete(task.id)}>
                          Done
                        </button>
                      ) : (
                        <span className="text-success text-sm">✔</span>
                      )}
                    </div>
                    
                    {task.data && Object.keys(task.data).length > 0 && (
                      <div className="mt-4" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {Object.keys(task.data).map(key => (
                          <div key={key} style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--glass-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            flex: '1 1 auto',
                            minWidth: 'max-content'
                          }}>
                            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)' }}>{key}</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 500, color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                              {typeof task.data[key] === 'boolean' ? (task.data[key] ? 'Yes' : 'No') : task.data[key]}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TaskList;