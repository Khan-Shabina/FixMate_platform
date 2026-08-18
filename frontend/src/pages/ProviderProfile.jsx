import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, MapPin, Briefcase, PhoneCall, MessageSquare, Award, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function ProviderProfile({ provider, setCurrentPage, setSelectedProvider }) {
  const [currentProvider, setCurrentProvider] = useState(provider || null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const loadProviderDetails = async () => {
      let p = provider;
      if (!p) {
        const list = await apiService.getProviders();
        if (Array.isArray(list) && list.length > 0) {
          p = list[0];
          setCurrentProvider(p);
        }
      }
      if (p) {
        const pId = p.providerId || p.id;
        if (pId) {
          setLoadingReviews(true);
          const revList = await apiService.getProviderReviews(pId);
          if (Array.isArray(revList)) {
            setReviews(revList);
          }
          setLoadingReviews(false);
        }
      }
    };
    loadProviderDetails();
  }, [provider]);

  if (!currentProvider) {
    return (
      <div className="container py-5 text-center text-muted">
        <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div> Loading provider details...
      </div>
    );
  }

  const p = currentProvider;
  const isVerified = p.verificationStatus === 'VERIFIED' || p.verified === true;
  const isAvailable = p.isAvailable !== undefined ? p.isAvailable : (p.available !== undefined ? p.available : true);
  const avatarImg = p.img || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=faces';
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '4.9';

  return (
    <div className="container py-5">
      <div className="card card-fixmate border-0 shadow-lg p-4 p-md-5 mb-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-3 text-center">
            <img 
              src={avatarImg} 
              alt={p.name} 
              className="rounded-circle object-fit-cover border border-4 border-white shadow mb-3"
              style={{ width: '130px', height: '130px' }}
            />
            <div>
              <span className={`badge ${isAvailable ? 'badge-available' : 'badge-busy'} rounded-pill px-3 py-1`}>
                {isAvailable ? '🟢 Available Now' : '🔴 Busy / Off-Duty'}
              </span>
            </div>
          </div>

          <div className="col-md-9">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
              <div>
                <div className="d-flex align-items-center gap-2">
                  <h3 className="fw-extrabold text-dark mb-0">{p.name || (p.user ? p.user.name : 'Service Professional')}</h3>
                  {isVerified && (
                    <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <p className="text-primary fw-semibold fs-5 mb-0">{p.role || p.experience || 'Maintenance Expert'}</p>
              </div>
              <button 
                className="btn btn-fixmate-primary btn-lg rounded-pill px-4 fw-bold shadow-sm"
                onClick={() => {
                  if (setSelectedProvider) setSelectedProvider(p);
                  setCurrentPage('booking');
                }}
              >
                Book Appointment Now
              </button>
            </div>

            <div className="d-flex flex-wrap align-items-center gap-3 text-muted mb-3">
              <span className="d-flex align-items-center gap-1"><MapPin size={16} /> {p.location || 'Local Area'}</span>
              <span className="d-flex align-items-center gap-1"><Briefcase size={16} /> {p.experience || 'Experienced'} Experience</span>
              <span className="d-flex align-items-center gap-1"><PhoneCall size={16} /> {p.phone || (p.user ? p.user.phone : '+91 98200 11223')}</span>
            </div>

            {/* Differentiator explanation */}
            <div className="alert alert-info bg-opacity-10 border-info border-opacity-25 small mb-3 py-2">
              <strong>FixMate Community Trust Score ({p.trustScore || 85}/100):</strong> Combines background verification, completed job rate, authentic verified customer feedback, and job reliability.
            </div>

            {/* Metrics Chips */}
            <div className="row g-3 text-center">
              <div className="col-4">
                <div className="bg-light p-3 rounded-3 border">
                  <div className="text-warning fw-extrabold fs-4 d-flex align-items-center justify-content-center gap-1">
                    <Star size={20} fill="currentColor" /> {avgRating}
                  </div>
                  <small className="text-muted">Customer Rating</small>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-light p-3 rounded-3 border">
                  <div className="text-success fw-extrabold fs-4 d-flex align-items-center justify-content-center gap-1">
                    <ShieldCheck size={20} /> {p.trustScore || 85}%
                  </div>
                  <small className="text-muted">Trust Score</small>
                </div>
              </div>
              <div className="col-4">
                <div className="bg-light p-3 rounded-3 border">
                  <div className="text-primary fw-extrabold fs-4 d-flex align-items-center justify-content-center gap-1">
                    <Award size={20} /> {reviews.length > 0 ? `${reviews.length} Verified` : 'Active'}
                  </div>
                  <small className="text-muted">Customer Reviews</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="card card-fixmate p-4">
        <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <MessageSquare size={20} className="text-primary" /> Verified Customer Reviews ({reviews.length})
        </h5>
        
        {loadingReviews ? (
          <div className="text-center py-4 text-muted small">
            <div className="spinner-border spinner-border-sm me-2 text-primary"></div> Loading verified reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-3 bg-light rounded-3 text-center text-muted small">
            No customer reviews yet for this provider. Book a service to be the first to leave a verified review!
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.reviewId} className="border-bottom pb-3 mb-3">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fw-bold text-dark">{rev.customerName || 'Verified Resident'}</span>
                <span className="text-warning fw-bold">
                  {'⭐'.repeat(rev.rating)} {rev.rating}.0
                </span>
              </div>
              <p className="text-muted small mb-1">{rev.comment || 'Quality service delivered promptly.'}</p>
              <small className="text-secondary opacity-75">{rev.date ? rev.date.split('T')[0] : 'Recent'}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
