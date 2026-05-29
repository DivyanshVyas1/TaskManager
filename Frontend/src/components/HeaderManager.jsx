import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HeaderManager = ({ fetchHeaders, headers }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [headerName, setHeaderName] = useState('');
  const [fields, setFields] = useState([{ name: '', type: 'text' }]);

  const handleAddField = () => {
    setFields([...fields, { name: '', type: 'text' }]);
  };

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleRemoveField = (index) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleSaveHeader = async (e) => {
    e.preventDefault();
    if (!headerName) return;

    // Filter out empty field names
    const validFields = fields.filter(f => f.name.trim() !== '');

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/headers`, {
        name: headerName,
        fields: validFields
      });
      setHeaderName('');
      setFields([{ name: '', type: 'text' }]);
      setIsCreating(false);
      fetchHeaders();
    } catch (err) {
      console.error('Error creating header:', err);
    }
  };

  const handleDeleteHeader = async (id) => {
    if (!window.confirm('Are you sure? This will delete all items under this header too.')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/headers/${id}`);
      fetchHeaders();
    } catch (err) {
      console.error('Error deleting header:', err);
    }
  };

  return (
    <div className="glass-panel p-6 mb-6" style={{ padding: '1.5rem' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Trackers (Headers)</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? 'Cancel' : '+ New Tracker'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleSaveHeader} className="mb-6 p-4" style={{ background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
          <div className="input-group">
            <label>Tracker Name (e.g., Movies, Study, Habits)</label>
            <input 
              type="text" 
              className="input-field" 
              value={headerName} 
              onChange={(e) => setHeaderName(e.target.value)} 
              placeholder="Enter name..."
              required
            />
          </div>

          <h4 className="font-semibold mb-4 mt-6">Custom Fields</h4>
          
          {/* Default Title Field */}
          <div className="flex items-center mb-3" style={{ gap: '1rem', flexWrap: 'nowrap', opacity: 0.7 }}>
            <input 
              type="text" 
              className="input-field" 
              value="Title (Compulsory)"
              disabled
              style={{ marginBottom: 0, flex: 2, minWidth: '150px' }}
            />
            <select 
              className="input-field" 
              disabled
              style={{ marginBottom: 0, flex: 1, minWidth: '120px' }}
            >
              <option>Text</option>
            </select>
            <button type="button" className="btn btn-outline" disabled style={{ visibility: 'hidden' }}>
              ✕
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={index} className="flex items-center mb-3" style={{ gap: '1rem', flexWrap: 'nowrap' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Field Name (e.g., Rating)" 
                value={field.name}
                onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                style={{ marginBottom: 0, flex: 2, minWidth: '150px' }}
                required
              />
              <select 
                className="input-field" 
                value={field.type}
                onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
                style={{ marginBottom: 0, flex: 1, minWidth: '120px' }}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="textarea">Long Text</option>
                <option value="slider">Slider (0-100)</option>
                <option value="boolean">Yes/No</option>
                <option value="date">Date</option>
              </select>
              <button type="button" className="btn btn-outline" onClick={() => handleRemoveField(index)} style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-outline mt-2 mb-4" onClick={handleAddField}>
            + Add Field
          </button>
          
          <div className="mt-6 flex justify-end">
            <button type="submit" className="btn btn-primary">Save Tracker</button>
          </div>
        </form>
      )}

      {headers.length > 0 ? (
        <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
          {headers.map(header => (
            <div key={header.id} className="glass-panel" style={{ padding: '1rem', flex: '1 1 200px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '1.1rem' }}>{header.name}</strong>
                <div className="text-muted text-sm mt-1">{header.fields?.length || 0} fields</div>
              </div>
              <button className="btn btn-outline" style={{ padding: '4px 8px', borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => handleDeleteHeader(header.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted text-center py-4">No trackers created yet. Create one above!</p>
      )}
    </div>
  );
};

export default HeaderManager;
