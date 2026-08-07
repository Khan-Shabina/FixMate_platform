import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckCircle, Wrench } from 'lucide-react';
import { mockServices } from '../data/mockData';

export default function ManageServices({ setCurrentPage }) {
  const [services, setServices] = useState(mockServices.slice(0, 3));
  const [newServiceName, setNewServiceName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Electrician');

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceName || !newPrice) return;
    setServices([
      ...services,
      {
        id: Date.now(),
        name: newServiceName,
        price: parseFloat(newPrice),
        category: newCategory,
        description: 'Custom service added by provider.',
        count: 'New service'
      }
    ]);
    setNewServiceName('');
    setNewPrice('');
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <span className="badge bg-info text-dark fw-bold mb-1">Provider Service Catalog</span>
          <h2 className="fw-extrabold text-dark mb-0">Manage Offered Services</h2>
          <p className="text-muted small">Add new services, update base prices, or toggle active listings.</p>
        </div>
        <button className="btn btn-outline-secondary rounded-pill px-4 fw-bold" onClick={() => setCurrentPage('provider-dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="row g-4">
        {/* Add New Service Form */}
        <div className="col-lg-4">
          <div className="card card-fixmate p-4">
            <h5 className="fw-bold text-dark mb-3">Add New Service Offering</h5>
            <form onSubmit={handleAddService}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Service Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Inverter Wiring & Installation"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Category</label>
                <select className="form-select" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="AC Repair">AC Repair</option>
                  <option value="Cleaning">Cleaning</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Base Rate (₹)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="499"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="btn btn-fixmate-primary w-100 rounded-pill fw-bold">
                <Plus size={16} className="me-1 d-inline" /> Add Service Listing
              </button>
            </form>
          </div>
        </div>

        {/* Existing Offered Services List */}
        <div className="col-lg-8">
          <div className="card card-fixmate p-4">
            <h5 className="fw-bold text-dark mb-3">Your Active Services ({services.length})</h5>
            <div className="d-grid gap-3">
              {services.map((s) => (
                <div key={s.id} className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between">
                  <div>
                    <span className="badge bg-primary mb-1">{s.category}</span>
                    <h6 className="fw-bold text-dark mb-0">{s.name}</h6>
                    <small className="text-muted">{s.description}</small>
                  </div>
                  <div className="text-end">
                    <span className="fw-extrabold fs-5 text-dark d-block">₹{s.price}</span>
                    <button className="btn btn-sm btn-outline-danger border-0 p-1 mt-1">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
