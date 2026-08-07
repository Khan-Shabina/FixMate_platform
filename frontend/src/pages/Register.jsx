import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Wrench, MapPin, Briefcase } from 'lucide-react';
import { apiService } from '../services/api';

export default function Register({ setCurrentPage, setCurrentRole, setUser }) {
  const [role, setRole] = useState('ROLE_CUSTOMER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('5 Years');
  const [location, setLocation] = useState('Andheri East, Mumbai');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await apiService.register({
      name, email, phone, password, role, experience, location
    });
    setUser(res);
    setCurrentRole(res.role);
    setLoading(false);
    if (res.role === 'ROLE_PROVIDER') setCurrentPage('provider-dashboard');
    else setCurrentPage('customer-dashboard');
  };

  return (
    <div className="container py-5 min-vh-75 d-flex align-items-center justify-content-center">
      <div className="card card-fixmate border-0 shadow-lg p-4 p-md-5" style={{ maxWidth: '540px', width: '100%' }}>
        <div className="text-center mb-4">
          <h3 className="fw-extrabold text-dark">Join FixMate Community</h3>
          <p className="text-muted small">Register as a customer or skilled service provider</p>
        </div>

        {/* Role Toggle */}
        <div className="btn-group w-100 mb-4 p-1 bg-light rounded-3 border">
          <button 
            type="button" 
            className={`btn btn-sm rounded-2 fw-bold py-2 ${role === 'ROLE_CUSTOMER' ? 'btn-white bg-white text-primary shadow-sm' : 'text-muted'}`}
            onClick={() => setRole('ROLE_CUSTOMER')}
          >
            👤 Register as Customer
          </button>
          <button 
            type="button" 
            className={`btn btn-sm rounded-2 fw-bold py-2 ${role === 'ROLE_PROVIDER' ? 'btn-white bg-white text-primary shadow-sm' : 'text-muted'}`}
            onClick={() => setRole('ROLE_PROVIDER')}
          >
            🔧 Register as Worker / Provider
          </button>
        </div>

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
            <div className="row g-3 mb-3 p-3 bg-light rounded-3 border">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-secondary">Experience</label>
                <input type="text" className="form-control py-2" placeholder="e.g. 5 Years" value={experience} onChange={(e) => setExperience(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-secondary">Work Location</label>
                <input type="text" className="form-control py-2" placeholder="e.g. Andheri, Mumbai" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Lock size={18} className="text-muted" /></span>
              <input type="password" className="form-control border-start-0 py-2" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn btn-fixmate-primary w-100 py-2.5 fw-bold mb-3" disabled={loading}>
            {loading ? 'Creating Account...' : 'Complete Registration'}
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
