import React, { useState, useEffect } from 'react';
import { CheckCircle2, ShieldCheck, AlertCircle, ArrowLeft, XCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function ProviderVerification({ setCurrentPage }) {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [verifyingId, setVerifyingId] = useState(null);

  const fetchProviders = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await apiService.getProviders();
      if (Array.isArray(data)) {
        setProviders(data);
      } else {
        setErrorMsg('Failed to load service providers.');
      }
    } catch {
      setErrorMsg('Failed to connect to backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleVerify = async (id, status) => {
    setErrorMsg('');
    setActionMsg('');
    setVerifyingId(id);
    const result = await apiService.verifyProvider(id, status);
    setVerifyingId(null);
    if (result.success) {
      setActionMsg(`Provider #${id} has been marked as ${status}. Trust score has been recalculated.`);
      fetchProviders();
    } else {
      setErrorMsg(result.error || 'Failed to update provider status');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <span className="badge bg-danger text-white fw-bold mb-1">Admin Operations</span>
          <h2 className="fw-extrabold text-dark mb-0">Worker Verification & Onboarding</h2>
          <p className="text-muted small">Verify skilled worker credentials, experience, and background check documents before granting full platform dispatch status.</p>
        </div>
        <button className="btn btn-outline-secondary rounded-pill px-4 fw-bold d-flex align-items-center gap-1" onClick={() => setCurrentPage('admin-dashboard')}>
          <ArrowLeft size={16} /> Back to Admin Hub
        </button>
      </div>

      {actionMsg && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
          <CheckCircle2 size={18} /> {actionMsg}
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5 text-muted card card-fixmate p-5">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div> Loading worker applications...
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-5 text-muted card card-fixmate p-5">
          No service providers registered on the platform yet.
        </div>
      ) : (
        <div className="row g-4">
          {providers.map((p) => {
            const isVerified = p.verified === true || p.verificationStatus === 'VERIFIED';
            const isRejected = p.verificationStatus === 'REJECTED';
            const id = p.id || p.providerId;

            return (
              <div className="col-lg-6" key={id}>
                <div className={`card card-fixmate p-4 h-100 shadow-sm border-0 ${!isVerified && !isRejected ? 'border-warning border-2' : ''}`}>
                  <div className="d-flex align-items-start gap-3 mb-3">
                    <img 
                      src={p.img || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=faces'} 
                      alt={p.name} 
                      className="rounded-circle object-fit-cover shadow-sm" 
                      style={{ width: '64px', height: '64px' }} 
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="fw-bold text-dark mb-0">{p.name || p.user?.name}</h5>
                        <span className={`badge ${isVerified ? 'bg-success' : isRejected ? 'bg-danger' : 'bg-warning text-dark'} rounded-pill px-3 py-1 fw-bold`}>
                          {isVerified ? '✓ VERIFIED' : isRejected ? '✕ REJECTED' : '⏳ PENDING REVIEW'}
                        </span>
                      </div>
                      <p className="text-primary fw-semibold small mb-1">{p.role || p.experience || 'Service Technician'}</p>
                      <small className="text-muted d-block">{p.location || 'Local Area'} • {p.experience || 'Experienced'} Experience</small>
                    </div>
                  </div>

                  <div className="bg-light p-3 rounded-3 mb-3 border small">
                    <strong className="d-block mb-1 text-dark">Identity & Background Check:</strong>
                    <ul className="list-unstyled mb-0 text-muted">
                      <li>📄 Phone Contact: <strong>{p.phone || (p.user ? p.user.phone : '+91 98200 11223')}</strong></li>
                      <li>📧 Email: <strong>{p.email || (p.user ? p.user.email : 'provider@fixmate.com')}</strong></li>
                      <li>🛡️ FixMate Trust Score: <strong>{p.trustScore || 85}%</strong></li>
                    </ul>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
                    <span className="text-muted small">Status: <strong>{p.verificationStatus || 'PENDING'}</strong></span>

                    <div className="d-flex gap-2">
                      {!isVerified ? (
                        <>
                          <button 
                            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" 
                            onClick={() => handleVerify(id, 'REJECTED')}
                            disabled={verifyingId === id}
                          >
                            Reject
                          </button>
                          <button 
                            className="btn btn-success btn-sm rounded-pill px-3 fw-bold" 
                            onClick={() => handleVerify(id, 'VERIFIED')}
                            disabled={verifyingId === id}
                          >
                            {verifyingId === id ? 'Verifying...' : 'Approve & Verify ✓'}
                          </button>
                        </>
                      ) : (
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-success fw-bold small d-flex align-items-center gap-1">
                            <CheckCircle2 size={16} /> Verified Active Worker
                          </span>
                          <button 
                            className="btn btn-outline-danger btn-sm rounded-pill px-2 py-0.5 small"
                            onClick={() => handleVerify(id, 'REJECTED')}
                            title="Revoke Verification"
                          >
                            Revoke
                          </button>
                        </div>
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
