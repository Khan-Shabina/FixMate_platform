import React, { useState } from 'react';
import { Lock, Mail, Shield, User, Wrench, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';

export default function Login({ setCurrentPage, setCurrentRole, setUser }) {
  const [email, setEmail] = useState('customer@fixmate.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('ROLE_CUSTOMER');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await apiService.login(email, password);
    setUser(data);
    setCurrentRole(data.role);
    setLoading(false);
    if (data.role === 'ROLE_PROVIDER') setCurrentPage('provider-dashboard');
    else if (data.role === 'ROLE_ADMIN') setCurrentPage('admin-dashboard');
    else setCurrentPage('customer-dashboard');
  };

  const setQuickDemo = (role) => {
    if (role === 'ROLE_CUSTOMER') {
      setEmail('customer@fixmate.com');
      setSelectedRole('ROLE_CUSTOMER');
    } else if (role === 'ROLE_PROVIDER') {
      setEmail('rahul.provider@fixmate.com');
      setSelectedRole('ROLE_PROVIDER');
    } else {
      setEmail('admin@fixmate.com');
      setSelectedRole('ROLE_ADMIN');
    }
  };

  return (
    <div className="container py-5 min-vh-75 d-flex align-items-center justify-content-center">
      <div className="card card-fixmate border-0 shadow-lg p-4 p-md-5" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="text-center mb-4">
          <div className="rounded-3 bg-fixmate-navy p-3 text-white d-inline-flex mb-3">
            <Wrench size={30} className="text-fixmate-orange" />
          </div>
          <h3 className="fw-extrabold text-dark">Welcome Back</h3>
          <p className="text-muted small">Sign in to manage your bookings and services</p>
        </div>

        {/* Role Quick Switcher */}
        <div className="btn-group w-100 mb-4 p-1 bg-light rounded-3 border">
          <button 
            type="button" 
            className={`btn btn-sm rounded-2 fw-bold ${selectedRole === 'ROLE_CUSTOMER' ? 'btn-white bg-white text-primary shadow-sm' : 'text-muted'}`}
            onClick={() => setQuickDemo('ROLE_CUSTOMER')}
          >
            Customer
          </button>
          <button 
            type="button" 
            className={`btn btn-sm rounded-2 fw-bold ${selectedRole === 'ROLE_PROVIDER' ? 'btn-white bg-white text-primary shadow-sm' : 'text-muted'}`}
            onClick={() => setQuickDemo('ROLE_PROVIDER')}
          >
            Provider
          </button>
          <button 
            type="button" 
            className={`btn btn-sm rounded-2 fw-bold ${selectedRole === 'ROLE_ADMIN' ? 'btn-white bg-white text-primary shadow-sm' : 'text-muted'}`}
            onClick={() => setQuickDemo('ROLE_ADMIN')}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Mail size={18} className="text-muted" /></span>
              <input 
                type="email" 
                className="form-control border-start-0 py-2" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0"><Lock size={18} className="text-muted" /></span>
              <input 
                type="password" 
                className="form-control border-start-0 py-2" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-fixmate-primary w-100 py-2.5 fw-bold mb-3" disabled={loading}>
            {loading ? 'Authenticating with Spring Security...' : 'Sign In'} <ArrowRight size={16} className="ms-1 d-inline" />
          </button>
        </form>

        <div className="text-center pt-3 border-top">
          <span className="text-muted small">Don't have an account? </span>
          <button className="btn btn-link p-0 text-primary fw-bold small text-decoration-none" onClick={() => setCurrentPage('register')}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
