import React from 'react';
import { Star, ShieldCheck, MapPin, Briefcase, PhoneCall, MessageSquare, Award } from 'lucide-react';
import { mockProviders } from '../data/mockData';

export default function ProviderProfile({ provider, setCurrentPage, setSelectedProvider }) {
  const p = provider || mockProviders[0];

  return (
    <div className="container py-5">
      <div className="card card-fixmate border-0 shadow-lg p-4 p-md-5 mb-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-3 text-center">
            <img 
              src={p.img} 
              alt={p.name} 
              className="rounded-circle object-fit-cover border border-4 border-white shadow mb-3"
              style={{ width: '130px', height: '130px' }}
            />
            <div>
              <span className={`badge ${p.available ? 'badge-available' : 'badge-busy'} rounded-pill px-3 py-1`}>
                {p.available ? '🟢 Available Now' : '🔴 Busy'}
              </span>
            </div>
          </div>

          <div className="col-md-9">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
              <div>
                <h3 className="fw-extrabold text-dark mb-1">{p.name}</h3>
                <p className="text-primary fw-semibold fs-5 mb-0">{p.role}</p>
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
              <span className="d-flex align-items-center gap-1"><MapPin size={16} /> {p.location}</span>
              <span className="d-flex align-items-center gap-1"><Briefcase size={16} /> {p.experience} Experience</span>
              <span className="d-flex align-items-center gap-1"><PhoneCall size={16} /> {p.phone}</span>
            </div>

            <p className="text-secondary leading-relaxed mb-4">{p.bio}</p>

            {/* Metrics Chips */}
            <div className="row g-3 text-center">
              <div className="col-4">
                <div className="bg-light p-3 rounded-3 border">
                  <div className="text-warning fw-extrabold fs-4 d-flex align-items-center justify-content-center gap-1">
                    <Star size={20} fill="currentColor" /> {p.rating}
                  </div>
                  <small className="text-muted">Overall Rating</small>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-light p-3 rounded-3 border">
                  <div className="text-success fw-extrabold fs-4 d-flex align-items-center justify-content-center gap-1">
                    <ShieldCheck size={20} /> {p.trustScore}%
                  </div>
                  <small className="text-muted">Community Trust Score</small>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-light p-3 rounded-3 border">
                  <div className="text-primary fw-extrabold fs-4 d-flex align-items-center justify-content-center gap-1">
                    <Award size={20} /> {p.jobsCompleted}+
                  </div>
                  <small className="text-muted">Completed Jobs</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="card card-fixmate p-4">
        <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <MessageSquare size={20} className="text-primary" /> Verified Customer Reviews ({p.reviewsCount})
        </h5>
        
        <div className="border-bottom pb-3 mb-3">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="fw-bold text-dark">Siddhi Patil (Andheri East)</span>
            <span className="text-warning fw-bold">⭐⭐⭐⭐⭐ 5.0</span>
          </div>
          <p className="text-muted small mb-1">"Rahul fixed our main circuit breaker during midnight power trip. Extremely knowledgeable, fast, and polite!"</p>
          <small className="text-secondary opacity-75">Aug 5, 2026</small>
        </div>

        <div>
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="fw-bold text-dark">Shankar Sala (Powai)</span>
            <span className="text-warning fw-bold">⭐⭐⭐⭐⭐ 5.0</span>
          </div>
          <p className="text-muted small mb-1">"Prompt arrival and clear pricing upfront before starting work. Highly recommended!"</p>
          <small className="text-secondary opacity-75">Jul 28, 2026</small>
        </div>
      </div>
    </div>
  );
}
