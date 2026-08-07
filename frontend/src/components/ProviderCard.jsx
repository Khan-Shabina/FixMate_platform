import React from 'react';
import { Star, ShieldCheck, MapPin, Briefcase, PhoneCall, CheckCircle } from 'lucide-react';

export default function ProviderCard({ provider, onSelect, onViewProfile }) {
  return (
    <div className="card card-fixmate h-100 p-3">
      <div className="d-flex align-items-start gap-3">
        <div className="position-relative shrink-0">
          <img 
            src={provider.img} 
            alt={provider.name} 
            className="rounded-circle object-fit-cover border border-2 border-white shadow-sm"
            style={{ width: '64px', height: '64px' }}
          />
          {provider.verified && (
            <span className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '20px', height: '20px' }}>
              <CheckCircle size={12} />
            </span>
          )}
        </div>

        <div className="flex-grow-1 min-w-0">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="fw-bold text-dark text-truncate mb-0" onClick={() => onViewProfile(provider)} style={{ cursor: 'pointer' }}>
              {provider.name}
            </h6>
            <span className={`badge ${provider.available ? 'badge-available' : 'badge-busy'} rounded-pill`}>
              {provider.available ? '🟢 Available Now' : '🔴 Busy'}
            </span>
          </div>

          <p className="text-primary fw-semibold small mb-1">{provider.role}</p>

          <div className="d-flex align-items-center gap-2 text-muted small mb-2">
            <span className="d-flex align-items-center gap-1">
              <MapPin size={13} className="text-secondary" /> {provider.location}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="badge bg-warning bg-opacity-25 text-dark fw-bold d-flex align-items-center gap-1">
              <Star size={12} className="text-warning" fill="currentColor" /> {provider.rating}
            </span>
            <span className="badge badge-trust">
              🛡️ {provider.trustScore}% Trust Score
            </span>
            <span className="text-muted small">({provider.jobsCompleted} Jobs)</span>
          </div>

          <div className="d-flex gap-2 pt-2 border-top">
            <button 
              className="btn btn-outline-secondary btn-sm flex-fill rounded-pill fw-semibold"
              onClick={() => onViewProfile(provider)}
            >
              View Profile
            </button>
            <button 
              className="btn btn-fixmate-primary btn-sm flex-fill rounded-pill fw-semibold"
              onClick={() => onSelect(provider)}
            >
              Book Worker
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
