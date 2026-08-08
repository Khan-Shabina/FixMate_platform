import React, { useState } from 'react';
import { Search, ShieldCheck, Star, MapPin, CheckCircle, Phone, ArrowRight, Filter, Award } from 'lucide-react';
import ProviderCard from '../components/ProviderCard';
import { mockProviders } from '../data/mockData';

export default function Providers({ setCurrentPage, setSelectedProvider }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const categories = ['All', 'Electrician', 'Plumber', 'AC Repair', 'Cleaning', 'Appliance Repair'];

  const filteredProviders = mockProviders.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.role.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.location.toLowerCase().includes(search.toLowerCase()) ||
                          p.role.toLowerCase().includes(search.toLowerCase());
    const matchesAvailable = !onlyAvailable || p.available;
    return matchesCategory && matchesSearch && matchesAvailable;
  });

  return (
    <div className="container py-5">
      {/* Header Banner */}
      <div className="bg-fixmate-navy text-white p-4 p-md-5 rounded-4 shadow-sm mb-5 position-relative overflow-hidden">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-20 mb-3 small">
              <ShieldCheck size={16} className="text-warning" />
              <span className="fw-semibold">100% Background Verified Local Technicians</span>
            </div>
            <h2 className="fw-extrabold display-6 text-white mb-2">Verified Service Professionals</h2>
            <p className="text-light opacity-90 mb-0">Browse top-rated electricians, plumbers, and technicians near you with transparent community trust scores.</p>
          </div>
          <div className="col-lg-4 text-lg-end mt-4 mt-lg-0">
            <button className="btn btn-warning rounded-pill px-4 fw-bold shadow" onClick={() => setCurrentPage('register')}>
              Join as Worker / Provider <ArrowRight size={18} className="ms-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-4 shadow-sm border mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Search size={18} className="text-muted" /></span>
              <input 
                type="text" 
                className="form-control border-start-0 py-2" 
                placeholder="Search provider by name, skill, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-5">
            <div className="d-flex gap-2 overflow-x-auto pb-2 pb-lg-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`btn btn-sm rounded-pill px-3 fw-semibold shrink-0 ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="col-lg-2 text-lg-end">
            <div className="form-check form-switch d-inline-block text-start">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="availSwitch"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
              />
              <label className="form-check-label small fw-bold text-dark" htmlFor="availSwitch">
                🟢 Available Only
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Provider List Grid */}
      <div className="row g-4">
        {filteredProviders.length > 0 ? (
          filteredProviders.map((provider) => (
            <div className="col-lg-6" key={provider.id}>
              <ProviderCard 
                provider={provider}
                onSelect={(p) => {
                  setSelectedProvider(p);
                  setCurrentPage('booking');
                }}
                onViewProfile={(p) => {
                  setSelectedProvider(p);
                  setCurrentPage('provider-profile');
                }}
              />
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="p-4 bg-light rounded-4 max-w-md mx-auto">
              <Filter size={40} className="text-muted mb-3" />
              <h5 className="fw-bold text-dark">No Technicians Match Your Filter</h5>
              <p className="text-muted small">Try clearing your search query or enabling all availability options.</p>
              <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => { setSearch(''); setSelectedCategory('All'); setOnlyAvailable(false); }}>
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
