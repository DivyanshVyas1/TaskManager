import React, { useState, useEffect } from "react";
import axios from 'axios';

const TaskForm = ({ fetchTasks, headers }) => {
  const [selectedHeaderId, setSelectedHeaderId] = useState("");
  const [title, setTitle] = useState("");
  const [dynamicData, setDynamicData] = useState({});
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const selectedHeader = headers.find(h => h.id === selectedHeaderId);

  useEffect(() => {
    // Only search if user hasn't just clicked a suggestion and title is long enough
    if (!title || title.length < 2 || !showSuggestions) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await axios.get(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${title}&language=en&format=json&origin=*`);
        if (res.data && res.data.search) {
          setSuggestions(res.data.search);
        }
      } catch (err) {
        console.error('Wikidata fetch error', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [title, showSuggestions]);

  const handleHeaderChange = (e) => {
    setSelectedHeaderId(e.target.value);
    setDynamicData({});
  };

  const handleDynamicChange = (key, value) => {
    setDynamicData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !selectedHeaderId) return;
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, {
        headerId: selectedHeaderId,
        title,
        data: dynamicData,
      });
      setTitle("");
      setDynamicData({});
      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (headers.length === 0) {
    return <div className="glass-panel text-center py-6 text-muted">Create a Tracker Header above to start adding items!</div>;
  }

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
      
      <div className="input-group">
        <label>Select Tracker Header</label>
        <select className="input-field" value={selectedHeaderId} onChange={handleHeaderChange}>
          <option value="">-- Choose Tracker --</option>
          {headers.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>

      {selectedHeader && (
        <form onSubmit={handleSubmit} className="flex-col gap-4 animate-fade-in mt-4">
          <div className="input-group" style={{ marginBottom: '1rem', position: 'relative' }}>
            <label>Item Title (Auto-completes from Wikidata)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Inception"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              required
              autoComplete="off"
            />
            {showSuggestions && (suggestions.length > 0 || isSearching) && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                zIndex: 10,
                maxHeight: '200px',
                overflowY: 'auto',
                boxShadow: 'var(--shadow-lg)',
                marginTop: '4px'
              }}>
                {isSearching ? (
                  <div style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Searching Wikipedia...</div>
                ) : (
                  suggestions.map((s, idx) => (
                    <div 
                      key={idx} 
                      style={{ padding: '0.75rem', cursor: 'pointer', borderBottom: idx !== suggestions.length - 1 ? '1px solid var(--glass-border)' : 'none', transition: 'background 0.2s' }}
                      onMouseDown={() => {
                        setTitle(s.label);
                        setShowSuggestions(false);
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontWeight: 600 }}>{s.label}</div>
                      {s.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.description}</div>}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {selectedHeader.fields && selectedHeader.fields.map(field => (
              <div key={field.name} className="input-group" style={{ marginBottom: '1rem', gridColumn: field.type === 'textarea' ? 'span 2' : 'span 1' }}>
                <label>{field.name}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    className="input-field"
                    rows="2"
                    value={dynamicData[field.name] || ''}
                    onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                  ></textarea>
                ) : field.type === 'slider' ? (
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      style={{ flex: 1 }}
                      value={dynamicData[field.name] || 50}
                      onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                    />
                    <span>{dynamicData[field.name] || 50}</span>
                  </div>
                ) : field.type === 'boolean' ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      style={{ width: '20px', height: '20px' }}
                      checked={!!dynamicData[field.name]}
                      onChange={(e) => handleDynamicChange(field.name, e.target.checked)}
                    />
                    <span>Yes</span>
                  </div>
                ) : field.type === 'date' ? (
                  <input
                    type="date"
                    className="input-field"
                    value={dynamicData[field.name] || ''}
                    onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                  />
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    className="input-field"
                    value={dynamicData[field.name] || ''}
                    onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      )}
    </div>
  );
};

export default TaskForm;