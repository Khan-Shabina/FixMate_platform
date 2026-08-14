import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { apiService } from '../services/api';

export default function Services({ setCurrentPage, setSelectedService }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Electrician', 'Plumber', 'AC Repair', 'Cleaning', 'Appliance Repair', 'Carpentry', 'Pest Control'];

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const data = await apiService.getServices();
      if (Array.isArray(data)) {
        setServices(data.map(s => ({
          id: s.serviceId || s.id,
          name: s.serviceName || s.name,
          description: s.description || 'Professional service offering.',
          price: s.price,
          category: s.category || 'General',
          icon: s.icon || 'wrench',
          rating: s.rating || 4.8
        })));
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  const filtered = services.filter(s => {
    const sName = s.name || '';
    const sDesc = s.description || '';
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = sName.toLowerCase().includes(search.toLowerCase()) || sDesc.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="container py-5">
      <div className="text-center max-w-2xl mx-auto mb-5">
        <span className="badge bg-primary bg-opacity-10 text-primary fw-bold px-3 py-1 rounded-pill mb-2">Live Marketplace Catalog</span>
        <h2 className="fw-extrabold text-dark display-6">Services Catalog</h2>
        <p className="text-muted">Browse our comprehensive list of local maintenance, repair, and emergency services.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-4 shadow-sm border mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-lg-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Search size={18} className="text-muted" /></span>
              <input 
                type="text" 
                className="form-control border-start-0 py-2" 
                placeholder="Search services by title or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-6">
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
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div> Loading active services from catalog...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          No services found matching your criteria.
        </div>
      ) : (
        <div className="row g-4">
          {filtered.map((service) => (
            <div className="col-lg-4 col-md-6" key={service.id}>
              <ServiceCard 
                service={service}
                onBook={(srv) => {
                  setSelectedService(srv);
                  setCurrentPage('booking');
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
