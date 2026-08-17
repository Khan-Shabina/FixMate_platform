import React from 'react';
import { Star, ShieldCheck, MapPin, Briefcase, PhoneCall, CheckCircle, Calendar, MessageSquare, Award, ArrowLeft } from 'lucide-react';

export default function ProviderProfile({ provider, setCurrentPage, setSelectedProvider }) {
  if (!provider) {
    return (
      <div className="container py-5 text-center">
        <div className="card card-fixmate p-5 max-w-md mx-auto">
          <h5 className="fw-bold text-dark">No Provider Selected</h5>
          <p className="text-muted small mb-4">Please select a service provider from the technician directory.</p>
          <button className="btn btn-primary rounded-pill px-4 fw-bold mx-auto" onClick={() => setCurrentPage('providers')}>
            View Verified Providers
          </button>
        </div>
      </div>
    );
  }

  const p = provider;
  const isAvailable = p.isAvailable !== undefined ? p.isAvailable : p.available;

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary btn-sm rounded-pill mb-4 px-3 fw-semibold" onClick={() => setCurrentPage('providers')}>
        <ArrowLeft size={16} className="me-1 d-inline" /> Back to Providers
      </button>

      <div className="card card-fixmate border-0 shadow-lg p-4 p-md-5 mb-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-3 text-center">
            <div 
              className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center mx-auto shadow mb-3 fw-extrabold fs-1"
              style={{ width: '130px', height: '130px' }}
            >
              {(p.name || p.user?.name || 'P')[0]}
            </div>
            <div>
              <span className={`badge ${isAvailable ? 'bg-success' : 'bg-secondary'} rounded-pill px-3 py-1`}>
                {isAvailable ? '🟢 Available Now' : '🔴 Busy / Off-Duty'}
              </span>
            </div>
          </div>

          <div className="col-md-9">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
              <div>
                <h3 className="fw-extrabold text-dark mb-1">{p.name || p.user?.name}</h3>
                <p className="text-primary fw-semibold fs-5 mb-0">{p.role || p.category || 'Service Professional'}</p>
              </div>
              <button 
                className="btn btn-fixmate-primary btn-lg rounded-pill px-4 fw-bold shadow-sm"
                onClick={() => {
                  setSelectedProvider(p);
                  setCurrentPage('booking');
                }}
              >
                Book Appointment Now
              </button>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-3 text-muted mb-3">
              <span className="d-flex align-items-center gap-1"><MapPin size={16} /> {p.location || 'City'}</span>
              <span className="d-flex align-items-center gap-1"><Briefcase size={16} /> {p.experience || 'Experienced'}</span>
              {(p.phone || p.user?.phone) && (
                <span className="d-flex align-items-center gap-1"><PhoneCall size={16} /> {p.phone || p.user?.phone}</span>
              )}
            </div>

            <p className="text-secondary leading-relaxed mb-4">
              {p.bio || 'Verified independent technician specializing in residential and commercial maintenance repairs.'}
            </p>

            {/* Metrics Chips */}
            <div className="row g-3 text-center">
              <div className="col-6 col-md-4">
                <div className="bg-light p-3 rounded-3 border">
                  <div className="text-success fw-extrabold fs-4 d-flex align-items-center justify-content-center gap-1">
                    <ShieldCheck size={20} /> {p.trustScore || 85}%
                  </div>
                  <small className="text-muted">Dynamic Trust Score</small>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="bg-light p-3 rounded-3 border">
                  <div className="text-primary fw-extrabold fs-4 d-flex align-items-center justify-content-center gap-1">
                    <Award size={20} /> {p.verificationStatus || 'VERIFIED'}
                  </div>
                  <small className="text-muted">Verification Status</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
