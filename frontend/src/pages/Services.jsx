import React, { useState } from 'react';
import { Search, Filter, ArrowRight } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { mockServices } from '../data/mockData';

export default function Services({ setCurrentPage, setSelectedService }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Electrician', 'Plumber', 'AC Repair', 'Cleaning', 'Appliance Repair', 'Carpentry', 'Pest Control'];

  const filtered = mockServices.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="container py-5">
      <div className="text-center max-w-2xl mx-auto mb-5">
        <h2 className="fw-extrabold text-dark display-6">Services Catalog</h2>
        <p className="text-muted">Browse our comprehensive list of local maintenance & emergency repair services</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3 rounded-4 shadow-sm border mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-lg-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Search size={18} className="text-muted" /></span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Search services by keyword..."
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
    </div>
  );
}
