import React, { useState, useEffect } from 'react';
import { Search, Zap, ShieldCheck, ArrowRight, CheckCircle2, Clock, Calendar, Users, Award, Sparkles } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import ProviderCard from '../components/ProviderCard';
import { mockProviders } from '../data/mockData';
import { apiService } from '../services/api';

export default function Home({ setCurrentPage, setSelectedService, setSelectedProvider, onOpenEmergency }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProviders, setLoadingProviders] = useState(true);

  // Fetch Services from API
  useEffect(() => {
    const fetchServices = async () => {
      setLoadingServices(true);
      const data = await apiService.getServices();
      if (Array.isArray(data) && data.length > 0) {
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
    fetchServices();
  }, []);

  // Fetch Providers from API
  useEffect(() => {
    const fetchProviders = async () => {
      setLoadingProviders(true);
      const data = await apiService.getProviders();
      if (Array.isArray(data) && data.length > 0) {
        setProviders(data);
      } else {
        setProviders(mockProviders);
      }
      setLoadingProviders(false);
    };
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
      {/* 1. Hero Section */}
      <section className="hero-section py-5 py-lg-6 text-white position-relative">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            {/* Left Content */}
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-white bg-opacity-10 border border-white border-opacity-20 mb-3 small stagger-1">
                <span className="spinner-grow spinner-grow-sm text-warning" role="status"></span>
                <span className="fw-semibold text-white">Verified Service Professionals Active in Your Area</span>
              </div>

              <h1 className="display-4 fw-extrabold text-white mb-3 leading-tight stagger-1">
                Trusted Home Services, <span className="text-fixmate-orange">On Demand.</span>
              </h1>
              <p className="fs-5 text-light opacity-90 mb-4 max-w-xl stagger-2">
                Connect with background-verified electricians, plumbers, AC technicians, cleaners, and tutors. Book instantly or request priority emergency dispatch 24/7.
              </p>

              {/* Search Bar */}
              <div className="bg-white p-2 rounded-4 shadow-lg d-flex flex-column flex-sm-row gap-2 max-w-2xl mb-3 stagger-3">
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

              {/* Quick Filter Badges */}
              <div className="d-flex align-items-center gap-2 small stagger-4 flex-wrap">
                <span className="fw-semibold text-white">Popular Categories:</span>
                <span className="badge bg-white text-dark rounded-pill px-3 py-1.5 cursor-pointer shadow-sm" style={{ transition: 'all 0.2s ease' }} onClick={() => setSearchQuery('Electrician')}>Electrician</span>
                <span className="badge bg-white text-dark rounded-pill px-3 py-1.5 cursor-pointer shadow-sm" style={{ transition: 'all 0.2s ease' }} onClick={() => setSearchQuery('Plumber')}>Plumber</span>
                <span className="badge bg-white text-dark rounded-pill px-3 py-1.5 cursor-pointer shadow-sm" style={{ transition: 'all 0.2s ease' }} onClick={() => setSearchQuery('AC Repair')}>AC Repair</span>
                <span className="badge bg-white text-dark rounded-pill px-3 py-1.5 cursor-pointer shadow-sm" style={{ transition: 'all 0.2s ease' }} onClick={() => setSearchQuery('Cleaning')}>Cleaning</span>
              </div>
            </div>

            {/* Right Card Visual */}
            <div className="col-lg-5">
              <div className="card border-0 rounded-4 bg-white text-dark p-4 shadow-2xl position-relative">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-success bg-opacity-10 text-success p-2 rounded-circle">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0 text-dark">Community Verified</h6>
                      <small className="text-muted">Transparent Worker Feedback</small>
                    </div>
                  </div>
                  <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1.5 rounded-pill">Verified Platform</span>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3 p-2.5 rounded-3 bg-light">
                  <img src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=100&h=100&fit=crop" alt="Rahul" className="rounded-circle" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-0 text-dark">Rahul Sharma</h6>
                    <small className="text-primary fw-semibold">Master Electrician • 🟢 Available Now</small>
                  </div>
                  <span className="badge bg-warning bg-opacity-25 text-dark fw-bold px-2.5 py-1">⭐ 4.9</span>
                </div>

                <div className="alert alert-warning border-0 bg-fixmate-orange-light text-dark mb-3 p-3 rounded-3 small">
                  <strong className="text-fixmate-orange">⚡ 24/7 Priority Emergency:</strong> Rapid technician dispatch for main power breakdowns and urgent leaks.
                </div>

                <button className="btn btn-emergency w-100 py-2.5" onClick={onOpenEmergency}>
                  <Zap size={18} fill="currentColor" className="me-1" /> Request Emergency Help Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Emergency Service Banner Section */}
      <section className="container my-5">
        <div className="bg-gradient p-4 p-md-5 rounded-4 text-dark shadow-lg position-relative overflow-hidden border border-warning border-opacity-25" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)' }}>
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-inline-flex align-items-center gap-2 bg-warning bg-opacity-25 px-3 py-1 rounded-pill small fw-bold mb-2 text-dark">
                <Zap size={16} className="text-warning" fill="currentColor" /> 24/7 Priority Emergency Support
              </div>
              <h2 className="fw-extrabold text-dark display-6 mb-2">Got an Urgent Leakage or Power Breakdown?</h2>
              <p className="fs-6 text-muted mb-0">Get connected with available emergency local technicians for immediate assistance.</p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <button className="btn btn-emergency btn-lg rounded-pill px-4 shadow" onClick={onOpenEmergency}>
                Request Help Instantly <ArrowRight size={18} className="ms-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Popular Services Section */}
      <section className="container my-5">
        <div className="d-flex align-items-end justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <span className="text-primary fw-bold text-uppercase tracking-wider small">Service Catalog</span>
            <h2 className="fw-extrabold text-dark mb-0">Popular Local Services</h2>
          </div>
          <button className="btn btn-outline-primary rounded-pill px-4 fw-semibold" onClick={() => setCurrentPage('services')}>
            View All Services →
          </button>
        </div>

        {loadingServices ? (
          <div className="text-center py-5 text-muted">
            <div className="spinner-border text-primary me-2" role="status"></div> Loading services...
          </div>
        ) : filteredServices.length > 0 ? (
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
        ) : (
          <div className="text-center py-5 bg-light rounded-4">
            <h5 className="fw-bold text-dark mb-1">No services matched your query</h5>
            <p className="text-muted small mb-3">Try searching for generic terms like Electrician, Plumber, or AC Repair.</p>
            <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => setSearchQuery('')}>Clear Search</button>
          </div>
        )}
      </section>

      {/* 4. Feature Highlights: Maintenance Reminders & Society Bookings */}
      <section className="container my-5">
        <div className="row g-4">
          {/* Maintenance Reminder Feature */}
          <div className="col-md-6">
            <div className="card card-fixmate p-4 h-100 bg-white border-start border-4 border-primary">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Calendar size={20} className="text-primary" />
                <span className="badge bg-primary bg-opacity-10 text-primary fw-bold rounded-pill">Preventive Care</span>
              </div>
              <h4 className="fw-bold text-dark mb-2">Automated Maintenance Reminders</h4>
              <p className="text-muted small mb-4">Never miss periodic AC jet servicing, RO purifier filter changes, or pest control treatments with custom due-date tracking.</p>
              <button 
                className="btn btn-outline-primary btn-sm rounded-pill fw-semibold align-self-start mt-auto"
                onClick={() => setCurrentPage('reminders')}
              >
                Explore Reminders →
              </button>
            </div>
          </div>

          {/* Society Group Booking Feature */}
          <div className="col-md-6">
            <div className="card card-fixmate p-4 h-100 bg-white border-start border-4 border-warning">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Users size={20} className="text-warning" />
                <span className="badge bg-warning bg-opacity-25 text-dark fw-bold rounded-pill">Community Savings</span>
              </div>
              <h4 className="fw-bold text-dark mb-2">Society Group Booking</h4>
              <p className="text-muted small mb-4">Coordinate bulk service requests with society neighbors to unlock group cost efficiencies for deep cleaning and pest control.</p>
              <button 
                className="btn btn-outline-warning text-dark border-warning btn-sm rounded-pill fw-semibold align-self-start mt-auto"
                onClick={() => setCurrentPage('society')}
              >
                Join Society Groups →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Top Rated Local Providers Section */}
      <section className="bg-light py-5">
        <div className="container py-3">
          <div className="text-center mb-5 max-w-2xl mx-auto">
            <span className="text-fixmate-orange fw-bold text-uppercase tracking-widest small">Verified Local Workers</span>
            <h2 className="fw-extrabold text-dark">Top Rated Skilled Technicians</h2>
            <p className="text-muted">Empowering independent skilled professionals with transparent customer ratings and verified experience records.</p>
          </div>

          {loadingProviders ? (
            <div className="text-center py-4 text-muted">
              <div className="spinner-border text-primary me-2" role="status"></div> Loading technicians...
            </div>
          ) : (
            <div className="row g-4">
              {providers.map((provider) => (
                <div className="col-lg-6" key={provider.id || provider.providerId}>
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

      {/* 6. Why Customers Choose FixMate Section (Factual Product Benefits) */}
      <section className="container my-5 py-3">
        <div className="text-center mb-5 max-w-2xl mx-auto">
          <span className="text-primary fw-bold text-uppercase tracking-wider small">Platform Excellence</span>
          <h2 className="fw-extrabold text-dark">Why Choose FixMate</h2>
          <p className="text-muted">Built to make local home repairs transparent, fast, and completely reliable.</p>
        </div>

        <div className="row g-4">
          <div className="col-md-3 col-sm-6">
            <div className="card card-fixmate p-4 h-100 text-center">
              <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-3 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                <ShieldCheck size={28} />
              </div>
              <h6 className="fw-bold text-dark mb-2">Verified Workers</h6>
              <p className="text-muted small mb-0">Technicians pass background checks and community trust verification.</p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card card-fixmate p-4 h-100 text-center">
              <div className="rounded-circle bg-warning bg-opacity-20 text-warning p-3 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                <Zap size={28} fill="currentColor" />
              </div>
              <h6 className="fw-bold text-dark mb-2">24/7 Emergency Help</h6>
              <p className="text-muted small mb-0">Priority dispatch for main leaks and sudden power breakdowns.</p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card card-fixmate p-4 h-100 text-center">
              <div className="rounded-circle bg-success bg-opacity-10 text-success p-3 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                <CheckCircle2 size={28} />
              </div>
              <h6 className="fw-bold text-dark mb-2">Upfront Estimates</h6>
              <p className="text-muted small mb-0">Clear, transparent service pricing with zero hidden charges.</p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="card card-fixmate p-4 h-100 text-center">
              <div className="rounded-circle bg-info bg-opacity-10 text-info p-3 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                <Clock size={28} />
              </div>
              <h6 className="fw-bold text-dark mb-2">Live Status Tracking</h6>
              <p className="text-muted small mb-0">Follow your booking progress from request to technician completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How FixMate Works (3-Step Guide) */}
      <section className="bg-light py-5">
        <div className="container py-3">
          <div className="text-center mb-5 max-w-2xl mx-auto">
            <h2 className="fw-extrabold text-dark">How FixMate Works</h2>
            <p className="text-muted">3 simple steps to reliable local home services</p>
          </div>

          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="card card-fixmate p-4 h-100">
                <div className="rounded-circle bg-primary bg-opacity-10 text-primary fw-extrabold fs-4 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  01
                </div>
                <h5 className="fw-bold text-dark">Search & Compare</h5>
                <p className="text-muted small mb-0">Browse verified local electricians, plumbers, and technicians filtered by skill, rating, and location.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card card-fixmate p-4 h-100">
                <div className="rounded-circle bg-warning bg-opacity-25 text-warning fw-extrabold fs-4 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  02
                </div>
                <h5 className="fw-bold text-dark">Book Instantly</h5>
                <p className="text-muted small mb-0">Select date, time, and address. Toggle Emergency mode for urgent breakdowns needing under 15-minute dispatch.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card card-fixmate p-4 h-100">
                <div className="rounded-circle bg-success bg-opacity-10 text-success fw-extrabold fs-4 mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                  03
                </div>
                <h5 className="fw-bold text-dark">Track & Review</h5>
                <p className="text-muted small mb-0">Follow live worker status (`Requested` → `Accepted` → `Completed`) and update worker Trust Score with your feedback.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Dual Call-to-Action Section */}
      <section className="container my-5">
        <div className="bg-fixmate-navy text-white p-4 p-md-5 rounded-4 shadow-lg position-relative overflow-hidden">
          <div className="row align-items-center g-4">
            {/* For Customers */}
            <div className="col-md-6 border-end-md border-white border-opacity-10 pe-md-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Sparkles size={20} className="text-warning" />
                <span className="fw-bold text-warning small text-uppercase">For Homeowners</span>
              </div>
              <h3 className="fw-extrabold text-white mb-2">Need a Service Done Today?</h3>
              <p className="text-light opacity-90 small mb-3">Browse verified local professionals for electrical, plumbing, AC, and deep cleaning services.</p>
              <button 
                className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm"
                onClick={() => setCurrentPage('services')}
              >
                Browse Services <ArrowRight size={16} className="ms-1" />
              </button>
            </div>

            {/* For Skilled Workers */}
            <div className="col-md-6 ps-md-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Award size={20} className="text-info" />
                <span className="fw-bold text-info small text-uppercase">For Skilled Technicians</span>
              </div>
              <h3 className="fw-extrabold text-white mb-2">Are You a Local Skilled Worker?</h3>
              <p className="text-light opacity-90 small mb-3">Join FixMate to offer services, connect with nearby customers, build your trust score, and grow your business.</p>
              <button 
                className="btn btn-outline-light rounded-pill px-4 fw-bold"
                onClick={() => setCurrentPage('register')}
              >
                Join as a Service Provider →
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
