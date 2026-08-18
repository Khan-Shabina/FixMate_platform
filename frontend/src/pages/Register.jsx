import React, { useState } from 'react';
import { User, Mail, Phone, Lock, MapPin, Briefcase, AlertCircle } from 'lucide-react';
import fixmateLogo from '../assets/fixmate-logo.jpeg';
import { apiService } from '../services/api';

export default function Register({ setCurrentPage, setUser }) {
  const [role, setRole] = useState('ROLE_CUSTOMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('');
  const [location, setLocation] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const result = await apiService.register({
      name, email, phone, password, role, experience, location
    });
    setLoading(false);

    if (result.success && result.user) {
      setUser(result.user);
      if (result.user.role === 'ROLE_PROVIDER') setCurrentPage('provider-dashboard');
      else setCurrentPage('customer-dashboard');
    } else {
      setErrorMsg(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container py-5 min-vh-75 d-flex align-items-center justify-content-center">
      <div className="card card-fixmate border-0 shadow-lg p-4 p-md-5" style={{ maxWidth: '540px', width: '100%' }}>
        <div className="text-center mb-4">
          <img
            src={fixmateLogo}
            alt="FixMate Logo"
            className="rounded-circle shadow-sm mb-3"
            style={{
              width: '64px',
              height: '64px',
              objectFit: 'cover'
            }}
          />
          <h3 className="fw-extrabold text-dark">Join FixMate Community</h3>
          <p className="text-muted small">Register as a customer or skilled local service provider</p>
        </div>

        {/* Role Toggle */}
        <div className="btn-group w-100 mb-4 p-1 bg-light rounded-3 border">
          <button
            type="button"
            className={`btn btn-sm rounded-2 fw-bold py-2 ${role === 'ROLE_CUSTOMER' ? 'btn-white bg-white text-primary shadow-sm' : 'text-muted'}`}
            onClick={() => setRole('ROLE_CUSTOMER')}
          >
            👤 Customer Account
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-2 fw-bold py-2 ${role === 'ROLE_PROVIDER' ? 'btn-white bg-white text-primary shadow-sm' : 'text-muted'}`}
            onClick={() => setRole('ROLE_PROVIDER')}
          >
            🔧 Skilled Provider / Worker
          </button>
        </div>

        {errorMsg && (
          <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger p-3 rounded-3 mb-4 d-flex align-items-start gap-2 small">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <strong>Registration Failed:</strong> {errorMsg}
            </div>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><User size={18} className="text-muted" /></span>
              <input type="text" className="form-control border-start-0 py-2" placeholder="e.g. Sumit Shelar" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><Mail size={18} className="text-muted" /></span>
                <input type="email" className="form-control border-start-0 py-2" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-bold text-secondary">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0"><Phone size={18} className="text-muted" /></span>
                <input type="tel" className="form-control border-start-0 py-2" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>
          </div>

          {role === 'ROLE_PROVIDER' && (
            <div className="provider-details mb-3 p-3 bg-light rounded-3 border">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary mb-1">
                    Years of Experience
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <Briefcase size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 py-2"
                      placeholder="e.g. 5 Years"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary mb-1">
                    Service Work Location
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <MapPin size={16} className="text-muted" />
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 py-2"
                      placeholder="e.g. Andheri, Mumbai"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">Account Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Lock size={18} className="text-muted" /></span>
              <input type="password" className="form-control border-start-0 py-2" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn btn-fixmate-primary w-100 py-2.5 fw-bold mb-3 shadow-sm" disabled={loading}>
            {loading ? (
              <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Creating Account...</span>
            ) : (
              'Complete Registration'
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-top">
          <span className="text-muted small">Already have an account? </span>
          <button className="btn btn-link p-0 text-primary fw-bold small text-decoration-none" onClick={() => setCurrentPage('login')}>
            Sign In Here
          </button>
        </div>
      </div>
    </div>
  );
}
