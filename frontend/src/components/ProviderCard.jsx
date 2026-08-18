import React from 'react';
import { Star, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ProviderCard({ provider, onSelect, onViewProfile }) {
  const isVerified = provider.verified === true || provider.verificationStatus === 'VERIFIED';
  const isAvailable = provider.available !== undefined ? provider.available : (provider.isAvailable !== undefined ? provider.isAvailable : true);
  const avatarImg = provider.img || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=faces';

  return (
    <div className="card card-fixmate h-100 p-3 shadow-sm border-0">
      <div className="d-flex align-items-start gap-3">
        <div className="position-relative shrink-0">
          <img 
            src={avatarImg} 
            alt={provider.name} 
            className="rounded-circle object-fit-cover border border-2 border-white shadow-sm"
            style={{ width: '64px', height: '64px' }}
          />
          {isVerified && (
            <span className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1 d-flex align-items-center justify-content-center shadow-sm" style={{ width: '20px', height: '20px' }} title="Verified FixMate Professional">
              <CheckCircle size={12} />
            </span>
          )}
        </div>

        <div className="flex-grow-1 min-w-0">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="fw-bold text-dark text-truncate mb-0" onClick={() => onViewProfile && onViewProfile(provider)} style={{ cursor: 'pointer' }}>
              {provider.name}
            </h6>
            <span className={`badge ${isAvailable ? 'badge-available' : 'badge-busy'} rounded-pill`}>
              {isAvailable ? '🟢 Available' : '🔴 Busy'}
            </span>
          </div>

          <p className="text-primary fw-semibold small mb-1">{provider.role || provider.experience || 'Skilled Technician'}</p>

          <div className="d-flex align-items-center gap-2 text-muted small mb-2">
            <span className="d-flex align-items-center gap-1">
              <MapPin size={13} className="text-secondary" /> {provider.location || 'Local Area'}
            </span>
            <span>•</span>
            <span>{provider.experience || 'Experienced'}</span>
          </div>

          <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
            <span className="badge badge-trust d-flex align-items-center gap-1">
              <ShieldCheck size={13} /> {provider.trustScore || 85}% Trust Score
            </span>
            {isVerified && (
              <span className="badge bg-success bg-opacity-10 text-success fw-bold">
                ✓ Verified
              </span>
            )}
          </div>

          <div className="d-flex gap-2 pt-2 border-top">
            {onViewProfile && (
              <button 
                className="btn btn-outline-secondary btn-sm flex-fill rounded-pill fw-semibold"
                onClick={() => onViewProfile(provider)}
              >
                View Profile
              </button>
            )}
            {onSelect && (
              <button 
                className="btn btn-fixmate-primary btn-sm flex-fill rounded-pill fw-semibold"
                onClick={() => onSelect(provider)}
              >
                Book Worker
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
