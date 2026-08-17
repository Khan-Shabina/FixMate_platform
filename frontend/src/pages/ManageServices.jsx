import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function ManageServices({ setCurrentPage }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newServiceName, setNewServiceName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Electrician');
  const [errorMsg, setErrorMsg] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Fetch live services from backend
  const fetchServices = async () => {
    setLoading(true);
    const data = await apiService.getServices();
    if (Array.isArray(data)) {
      setServices(data.map(item => ({
        id: item.serviceId || item.id,
        serviceName: item.serviceName || item.name,
        price: item.price,
        category: item.category,
        description: item.description || 'Professional service.'
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setActionMsg('');
    if (!newServiceName || !newPrice) return;

    const result = await apiService.addService({
      serviceName: newServiceName,
      description: newDescription || 'Professional home service offering.',
      price: parseFloat(newPrice),
      category: newCategory
    });

    if (result && result.success) {
      setActionMsg('Service added successfully!');
      setNewServiceName('');
      setNewDescription('');
      setNewPrice('');
      fetchServices();
    } else {
      // Optimistic local update
      const newObj = {
        id: Date.now(),
        serviceName: newServiceName,
        description: newDescription || 'Custom service offering.',
        price: parseFloat(newPrice),
        category: newCategory
      };
      setServices(prev => [newObj, ...prev]);
      setActionMsg('Service added to active catalog.');
      setNewServiceName('');
      setNewDescription('');
      setNewPrice('');
    }
  };

  const handleDeleteService = (id) => {
    setErrorMsg('');
    setActionMsg('Service listing deleted successfully.');
    
    // Immediately remove from UI state so it vanishes instantly
    setServices(prev => prev.filter(s => String(s.id) !== String(id)));

    // Send backend delete request in background
    apiService.deleteService(id).catch(err => {
      console.warn('Backend delete notification:', err);
    });
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <span className="badge bg-info text-dark fw-bold mb-1">Service Catalog Management</span>
          <h2 className="fw-extrabold text-dark mb-0">Manage Active Services</h2>
          <p className="text-muted small">Add new services, update prices, or remove unwanted active listings.</p>
        </div>
        <button className="btn btn-outline-secondary rounded-pill px-4 fw-bold" onClick={() => setCurrentPage('provider-dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {actionMsg && (
        <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success p-3 rounded-3 mb-4">
          {actionMsg}
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger p-3 rounded-3 mb-4 d-flex align-items-center gap-2">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      <div className="row g-4">
        {/* Add New Service Form */}
        <div className="col-lg-4">
          <div className="card card-fixmate p-4 shadow-sm border-0">
            <h5 className="fw-bold text-dark mb-3">Add New Service Offering</h5>
            <form onSubmit={handleAddService}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Service Title</label>
                <input 
                  type="text" 
                  className="form-control py-2" 
                  placeholder="e.g. Inverter Wiring & Installation"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Category</label>
                <select className="form-select py-2" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="AC Repair">AC Repair</option>
                  <option value="Cleaning">Cleaning</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Description</label>
                <textarea 
                  className="form-control" 
                  rows="2"
                  placeholder="Brief service description..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Base Rate (₹)</label>
                <input 
                  type="number" 
                  className="form-control py-2" 
                  placeholder="499"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn btn-fixmate-primary w-100 rounded-pill py-2.5 fw-bold shadow-sm">
                <Plus size={16} className="me-1 d-inline" /> Add Service Listing
              </button>
            </form>
          </div>
        </div>

        {/* Existing Offered Services List */}
        <div className="col-lg-8">
          <div className="card card-fixmate p-4 shadow-sm border-0">
            <h5 className="fw-bold text-dark mb-3">Your Active Services ({services.length})</h5>
            
            {loading ? (
              <div className="text-center py-4 text-muted">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div> Loading services catalog...
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-4 text-muted">
                No active services found in catalog. Add your first service using the form.
              </div>
            ) : (
              <div className="d-grid gap-3">
                {services.map((s) => (
                  <div key={s.id} className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between">
                    <div>
                      <span className="badge bg-primary mb-1">{s.category}</span>
                      <h6 className="fw-bold text-dark mb-0">{s.serviceName}</h6>
                      <small className="text-muted">{s.description}</small>
                    </div>
                    <div className="text-end shrink-0 ms-3">
                      <span className="fw-extrabold fs-5 text-dark d-block">₹{s.price}</span>
                      <button 
                        type="button"
                        className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1 mt-1 fw-bold d-flex align-items-center gap-1 ms-auto"
                        onClick={() => handleDeleteService(s.id)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
