import React, { useState, useEffect } from 'react';
import { Search, Zap, ShieldCheck, Star, ArrowRight, CheckCircle, Clock, MapPin, Users, Sparkles, UserPlus } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import ProviderCard from '../components/ProviderCard';
import { apiService } from '../services/api';

export default function Home({ setCurrentPage, setSelectedService, setSelectedProvider, onOpenEmergency }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProviders, setLoadingProviders] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      const data = await apiService.getServices();
      if (Array.isArray(data)) {
        setServices(data.map(s => ({
          id: s.serviceId || s.id,
          name: s.serviceName || s.name,
          description: s.description || 'Professional home service offering.',
          price: s.price,
          category: s.category || 'General',
          icon: s.icon || 'wrench',
          rating: s.rating || 4.8
        })));
      }
      setLoadingServices(false);
    };

    const fetchProviders = async () => {
      setLoadingProviders(true);
      const data = await apiService.getProviders();
      if (Array.isArray(data)) {
        setProviders(data);
      }
      setLoadingProviders(false);
    };

    fetchServices();
    fetchProviders();
  }, []);

  const filteredServices = services.filter(s => {
    const name = s.name || '';
    const category = s.category || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section py-5 py-lg-6 text-white position-relative">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-20 mb-3 small">
                <span className="spinner-grow spinner-grow-sm text-warning" role="status"></span>
                <span className="fw-semibold">Verified Skilled Technicians & Service Pros</span>
              </div>

              <h1 className="display-4 fw-extrabold text-white mb-3 leading-tight">
                Trusted Local Services, <span className="text-fixmate-orange">On Demand.</span>
              </h1>
              <p className="fs-5 text-light opacity-90 mb-4 max-w-xl">
                Find verified electricians, plumbers, AC technicians, and cleaners. Book instantly, track live worker status, and solve emergency breakdowns 24/7.
              </p>

              {/* Search Bar */}
              <div className="bg-white p-2 rounded-4 shadow-lg d-flex flex-column flex-sm-row gap-2 max-w-2xl mb-3">
                <div className="input-group input-group-lg border-0">
                  <span className="input-group-text bg-white border-0 text-muted ps-3"><Search size={22} /></span>
                  <input 
                    type="text" 
                    className="form-control border-0 text-dark fs-6" 
                    placeholder="Search service (e.g. Electrician, Plumber, AC Service)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button 
                  className="btn btn-fixmate-primary btn-lg rounded-3 px-4 fw-bold shrink-0"
                  onClick={() => setCurrentPage('services')}
                >
                  Find Services
                </button>
              </div>

              <div className="d-flex align-items-center gap-2 text-light opacity-75 small">
                <span>Popular:</span>
                <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-2.5 py-1" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('Electrician')}>Electrician</span>
                <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-2.5 py-1" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('Plumber')}>Plumber</span>
                <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-2.5 py-1" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('AC Repair')}>AC Repair</span>
                <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-2.5 py-1" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('Cleaning')}>Cleaning</span>
              </div>
            </div>

            {/* Right Card / Platform Trust Visual */}
            <div className="col-lg-5">
              <div className="card border-0 rounded-4 bg-white text-dark p-4 shadow-2xl position-relative">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-success bg-opacity-10 text-success p-2 rounded-circle">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">Community Trust Engine</h6>
                      <small className="text-muted">Verified Feedback & Dynamic Ratings</small>
                    </div>
                  </div>
                  <span className="badge bg-success bg-opacity-10 text-success fw-bold fs-6">100% Verified</span>
                </div>

                <div className="p-3 rounded-3 bg-light mb-3">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <Zap size={18} className="text-fixmate-orange" />
                    <span className="fw-bold text-dark small">Priority Emergency Auto-Dispatch</span>
                  </div>
                  <p className="text-muted small mb-0">
                    Connect with available verified technicians near your neighborhood within 15 minutes for critical repairs.
                  </p>
                </div>

                <button className="btn btn-emergency w-100 py-2.5 mb-2" onClick={onOpenEmergency}>
                  <Zap size={18} fill="currentColor" className="me-1" /> Request Emergency Help Now
                </button>

                <button className="btn btn-outline-secondary w-100 py-2 rounded-3 small fw-semibold" onClick={() => setCurrentPage('register')}>
                  <UserPlus size={16} className="me-1 d-inline" /> Register as a Service Provider
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Service Banner Section */}
      <section className="container my-5">
        <div className="bg-gradient p-4 p-md-5 rounded-4 text-dark shadow-lg position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FED7AA 100%)' }}>
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-inline-flex align-items-center gap-2 bg-white bg-opacity-80 px-3 py-1 rounded-pill small fw-bold mb-2">
                <Zap size={16} className="text-danger" /> 24/7 Priority Emergency Support
              </div>
              <h2 className="fw-extrabold display-6 mb-2">Got an Urgent Leakage or Power Breakdown?</h2>
              <p className="fs-6 opacity-90 mb-0">Get connected with available emergency local technicians within seconds.</p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <button className="btn btn-danger fw-bold btn-lg rounded-pill px-4 shadow" onClick={onOpenEmergency}>
                Request Help Instantly <ArrowRight size={18} className="ms-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container my-5">
        <div className="d-flex align-items-end justify-content-between mb-4">
          <div>
            <span className="text-primary fw-bold text-uppercase tracking-wider small">Catalog</span>
            <h2 className="fw-extrabold text-dark mb-0">Available Services</h2>
          </div>
          <button className="btn btn-outline-primary rounded-pill px-4 fw-semibold" onClick={() => setCurrentPage('services')}>
            View All Services →
          </button>
        </div>

        {loadingServices ? (
          <div className="text-center py-4 text-muted">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div> Loading services...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-5 bg-light rounded-4">
            <h5 className="fw-bold text-dark">No services listed yet</h5>
            <p className="text-muted small mb-3">Service offerings can be created via the service management portal.</p>
            <button className="btn btn-primary btn-sm rounded-pill px-4" onClick={() => setCurrentPage('manage-services')}>
              + Add New Service
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredServices.slice(0, 8).map((service) => (
              <div className="col-lg-3 col-md-6" key={service.id}>
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
      </section>

      {/* Providers Section */}
      <section className="bg-light py-5">
        <div className="container py-3">
          <div className="text-center mb-5 max-w-2xl mx-auto">
            <span className="text-fixmate-orange fw-bold text-uppercase tracking-widest small">Community Trusted</span>
            <h2 className="fw-extrabold text-dark">Verified Local Technicians</h2>
            <p className="text-muted">Empowering independent skilled workers with transparent trust scores and authentic customer feedback.</p>
          </div>

          {loadingProviders ? (
            <div className="text-center py-4 text-muted">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div> Loading service providers...
            </div>
          ) : providers.length === 0 ? (
            <div className="text-center py-5 bg-white rounded-4 shadow-sm max-w-md mx-auto p-4">
              <Users size={40} className="text-muted mb-2" />
              <h5 className="fw-bold text-dark">No Service Providers Registered Yet</h5>
              <p className="text-muted small mb-3">Be the first skilled professional to join and start receiving customer service bookings in your area.</p>
              <button className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm" onClick={() => setCurrentPage('register')}>
                Register as a Provider
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {providers.map((provider) => (
                <div className="col-lg-6" key={provider.providerId || provider.id}>
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
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works */}
      <section className="container my-5 py-4">
        <div className="text-center mb-5">
          <h2 className="fw-extrabold text-dark">How FixMate Works</h2>
          <p className="text-muted">3 simple steps to reliable local home services</p>
        </div>

        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="card card-fixmate p-4 h-100">
              <div className="rounded-circle bg-primary bg-opacity-10 text-primary fw-extrabold fs-4 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                01
              </div>
              <h5 className="fw-bold">Search & Compare</h5>
              <p className="text-muted small mb-0">Browse verified local electricians, plumbers, and technicians filtered by location, rating, and trust score.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-fixmate p-4 h-100">
              <div className="rounded-circle bg-warning bg-opacity-25 text-warning fw-extrabold fs-4 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                02
              </div>
              <h5 className="fw-bold">Book Instantly</h5>
              <p className="text-muted small mb-0">Select date, time, and address. Toggle Emergency mode for urgent breakdowns needing under 15-minute dispatch.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-fixmate p-4 h-100">
              <div className="rounded-circle bg-success bg-opacity-10 text-success fw-extrabold fs-4 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                03
              </div>
              <h5 className="fw-bold">Track & Review</h5>
              <p className="text-muted small mb-0">Follow live worker status (`Requested` → `Accepted` → `Completed`) and update worker Trust Score with your review.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
