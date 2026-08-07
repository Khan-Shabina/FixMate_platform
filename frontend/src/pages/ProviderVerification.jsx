import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, FileText, MapPin, Award } from 'lucide-react';
import { mockProviders } from '../data/mockData';

export default function ProviderVerification({ setCurrentPage }) {
  const [providers, setProviders] = useState(mockProviders);

  const handleVerify = (id, status) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, verified: status === 'VERIFIED' } : p));
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

      <div className="row g-4">
        {providers.map((p) => (
          <div className="col-lg-6" key={p.id}>
            <div className="card card-fixmate p-4 h-100">
              <div className="d-flex align-items-start gap-3 mb-3">
                <img src={p.img} alt={p.name} className="rounded-circle" style={{ width: '64px', height: '64px' }} />
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold text-dark mb-0">{p.name}</h5>
                    <span className={`badge ${p.verified ? 'bg-success' : 'bg-warning text-dark'} rounded-pill px-3 py-1 fw-bold`}>
                      {p.verified ? '✓ VERIFIED WORKER' : '⏳ PENDING REVIEW'}
                    </span>
                  </div>
                  <p className="text-primary fw-semibold small mb-1">{p.role}</p>
                  <small className="text-muted d-block">{p.location} • {p.experience} Experience</small>
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
                <span className="text-muted small">Trust Score: <strong>{p.trustScore}%</strong></span>

                <div className="d-flex gap-2">
                  {!p.verified ? (
                    <>
                      <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" onClick={() => handleVerify(p.id, 'REJECTED')}>
                        Reject Application
                      </button>
                      <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold" onClick={() => handleVerify(p.id, 'VERIFIED')}>
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
        ))}
      </div>
    </div>
  );
}
