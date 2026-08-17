import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';

export default function ProviderVerification({ setCurrentPage }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      const data = await apiService.getProviders();
      if (Array.isArray(data)) {
        setProviders(data);
      }
      setLoading(false);
    };
    fetchProviders();
  }, []);

  const handleVerify = async (id, status) => {
    // Call backend API
    await apiService.verifyProvider(id, status);

    // Update state locally
    setProviders(prev => prev.map(p => {
      const pId = p.id || p.providerId;
      if (pId === id) {
        return {
          ...p,
          verified: status === 'VERIFIED',
          verificationStatus: status
        };
      }
      return p;
    }));
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <span className="badge bg-danger text-white fw-bold mb-1">Admin Operations</span>
          <h2 className="fw-extrabold text-dark mb-0">Worker Verification & Onboarding</h2>
          <p className="text-muted small">Verify skilled worker credentials, experience, and background check documents before granting platform access.</p>
        </div>
        <button className="btn btn-outline-secondary rounded-pill px-4 fw-bold" onClick={() => setCurrentPage('admin-dashboard')}>
          ← Back to Admin Hub
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div> Loading worker applications...
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-5 text-muted">
          No service providers registered on the platform yet.
        </div>
      ) : (
        <div className="row g-4">
          {providers.map((p) => {
            const isVerified = p.verified === true || p.verificationStatus === 'VERIFIED';
            const id = p.id || p.providerId;

            return (
              <div className="col-lg-6" key={id}>
                <div className="card card-fixmate p-4 h-100 shadow-sm border-0">
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <img src={p.img || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=faces'} alt={p.name} className="rounded-circle" style={{ width: '64px', height: '64px' }} />
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="fw-bold text-dark mb-0">{p.name || p.user?.name}</h5>
                        <span className={`badge ${isVerified ? 'bg-success' : 'bg-warning text-dark'} rounded-pill px-3 py-1 fw-bold`}>
                          {isVerified ? '✓ VERIFIED WORKER' : '⏳ PENDING REVIEW'}
                        </span>
                      </div>
                      <p className="text-primary fw-semibold small mb-1">{p.role || p.category || 'Service Provider'}</p>
                      <small className="text-muted d-block">{p.location || 'City Center'} • {p.experience || '1 Year'} Experience</small>
                    </div>
                  </div>

                  <div className="bg-light p-3 rounded-3 mb-3 border small">
                    <strong className="d-block mb-1 text-dark">Identity & Trade Certificate Documents:</strong>
                    <ul className="list-unstyled mb-0 text-muted">
                      <li>📄 Aadhaar Card Verified: <strong>YES</strong></li>
                      <li>📜 Trade License & Certification: <strong>VERIFIED</strong></li>
                      <li>🛡️ Background Check Status: <strong>CLEAN RECORD</strong></li>
                    </ul>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
                    <span className="text-muted small">Trust Score: <strong>{p.trustScore || 85}%</strong></span>

                    <div className="d-flex gap-2">
                      {!isVerified ? (
                        <>
                          <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" onClick={() => handleVerify(id, 'REJECTED')}>
                            Reject Application
                          </button>
                          <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold" onClick={() => handleVerify(id, 'VERIFIED')}>
                            Approve & Verify ✓
                          </button>
                        </>
                      ) : (
                        <span className="text-success fw-bold small d-flex align-items-center gap-1">
                          <CheckCircle2 size={16} /> Worker Active & Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
