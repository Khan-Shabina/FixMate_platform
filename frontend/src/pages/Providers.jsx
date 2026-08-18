import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ArrowRight, Filter, AlertCircle } from 'lucide-react';
import ProviderCard from '../components/ProviderCard';
import { apiService } from '../services/api';

export default function Providers({ setCurrentPage, setSelectedProvider }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [providersList, setProvidersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const data = await apiService.getProviders();
        if (Array.isArray(data)) {
          setProvidersList(data.map(p => ({
            id: p.providerId || p.id,
            providerId: p.providerId || p.id,
            userId: p.userId,
            name: p.name || (p.user ? p.user.name : 'Service Provider'),
            role: p.role || p.experience ? `${p.experience} Exp Technician` : 'Home Maintenance Specialist',
            location: p.location || 'Local Area',
            rating: 4.9,
            trustScore: p.trustScore || 85,
            available: p.isAvailable !== undefined ? p.isAvailable : (p.available !== undefined ? p.available : true),
            isAvailable: p.isAvailable !== undefined ? p.isAvailable : true,
            experience: p.experience || '3 Years',
            phone: p.phone || (p.user ? p.user.phone : '+91 98200 11223'),
            img: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=faces',
            verified: p.verificationStatus === 'VERIFIED' || p.verified === true,
            verificationStatus: p.verificationStatus || 'PENDING',
            bio: `Verified local service professional based in ${p.location || 'your area'}. Specializes in high-quality home repairs with community-backed trust metrics.`
          })));
        } else {
          setErrorMsg('Failed to load service providers.');
        }
      } catch {
        setErrorMsg('Could not connect to provider directory.');
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  const categories = ['All', 'Electrician', 'Plumber', 'AC Repair', 'Cleaning', 'Appliance Repair'];

  const filteredProviders = providersList.filter(p => {
    const role = p.role || '';
    const name = p.name || '';
    const location = p.location || '';
    const matchesCategory = selectedCategory === 'All' || role.toLowerCase().includes(selectedCategory.toLowerCase()) || (p.category && p.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || 
                          location.toLowerCase().includes(search.toLowerCase()) ||
                          role.toLowerCase().includes(search.toLowerCase());
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

      {errorMsg && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-4 shadow-sm border mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-lg-5">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Search size={18} className="text-muted" /></span>
              <input 
                type="text" 
                className="form-control border-start-0 py-2" 
                placeholder="Search provider by name or location..."
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
      {loading ? (
        <div className="text-center py-5 text-muted card card-fixmate p-5">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div> Loading verified local professionals...
        </div>
      ) : (
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
      )}
    </div>
  );
}
