import { useEffect, useState } from 'react';
import api from '../api';

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'LAB',
    capacity: '',
    status: 'AVAILABLE'
  });
  const [editingId, setEditingId] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.get('/resources');
      setResources(res.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch resources');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/resources/${editingId}`, form);
      } else {
        await api.post('/resources', form);
      }
      fetchResources();
      resetForm();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save resource');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await api.delete(`/resources/${id}`);
        fetchResources();
        setError('');
      } catch (err) {
        setError('Failed to delete resource');
      }
    }
  };

  const handleEdit = (resource) => {
    setForm({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity,
      status: resource.status
    });
    setEditingId(resource.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      name: '',
      type: 'LAB',
      capacity: '',
      status: 'AVAILABLE'
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <h1 className="page-title">Resource Management</h1>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Resource'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="LAB">LAB</option>
                <option value="CLASSROOM">CLASSROOM</option>
                <option value="EVENT_HALL">EVENT_HALL</option>
              </select>
            </div>

            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="UNAVAILABLE">UNAVAILABLE</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Resource' : 'Create Resource'}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={resetForm}
                style={{ marginLeft: '1rem' }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        )}
      </div>

      <div className="card">
        <h2>All Resources</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td>{resource.id}</td>
                <td>{resource.name}</td>
                <td>{resource.type}</td>
                <td>{resource.capacity}</td>
                <td>{resource.status}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleEdit(resource)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(resource.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {resources.length === 0 && <p style={{ textAlign: 'center', padding: '2rem' }}>No resources found</p>}
      </div>
    </div>
  );
}

export default Resources;
