import React from 'react';
import { ShieldCheck, Zap, UserCheck, Calendar, Users, Wrench, LayoutDashboard } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage, currentRole, setCurrentRole, onOpenEmergency, user }) {
  return (
    <nav className="navbar navbar-expand-lg sticky-top bg-white border-bottom shadow-sm py-2">
      <div className="container">
        {/* Brand Logo */}
        <button 
          className="navbar-brand d-flex align-items-center gap-2 border-0 bg-transparent text-start p-0 me-4"
          onClick={() => setCurrentPage('home')}
        >
          <div className="rounded-3 bg-fixmate-navy p-2 text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <Wrench size={22} className="text-fixmate-orange" />
          </div>
          <div>
            <span className="fw-extrabold fs-4 text-dark tracking-tight">Fix<span className="text-fixmate-orange">Mate</span></span>
            <small className="d-block text-muted" style={{ fontSize: '0.68rem', marginTop: '-4px' }}>Smart Local Services</small>
          </div>
        </button>

        {/* Mobile Toggle */}
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#fixmateNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Content */}
        <div className="collapse navbar-collapse" id="fixmateNav">
          {/* Main Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-semibold">
            <li className="nav-item">
              <button 
                className={`nav-link border-0 bg-transparent px-3 ${currentPage === 'home' ? 'text-primary active fw-bold' : 'text-secondary'}`}
                onClick={() => setCurrentPage('home')}
              >
                Home
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link border-0 bg-transparent px-3 ${currentPage === 'services' ? 'text-primary active fw-bold' : 'text-secondary'}`}
                onClick={() => setCurrentPage('services')}
              >
                Services
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link border-0 bg-transparent px-3 ${currentPage === 'providers' ? 'text-primary active fw-bold' : 'text-secondary'}`}
                onClick={() => setCurrentPage('providers')}
              >
                Providers
              </button>
            </li>

            {/* Customer Unique Feature Pages */}
            {currentRole === 'ROLE_CUSTOMER' && (
              <>
                <li className="nav-item">
                  <button 
                    className={`nav-link border-0 bg-transparent px-3 ${currentPage === 'reminders' ? 'text-primary active fw-bold' : 'text-secondary'}`}
                    onClick={() => setCurrentPage('reminders')}
                  >
                    <Calendar size={15} className="me-1" /> Reminders
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link border-0 bg-transparent px-3 ${currentPage === 'society' ? 'text-primary active fw-bold' : 'text-secondary'}`}
                    onClick={() => setCurrentPage('society')}
                  >
                    <Users size={15} className="me-1" /> Society Booking
                  </button>
                </li>
              </>
            )}

            {/* Dashboard Link based on Role */}
            <li className="nav-item">
              <button 
                className={`nav-link border-0 bg-transparent px-3 ${currentPage.includes('dashboard') ? 'text-primary active fw-bold' : 'text-secondary'}`}
                onClick={() => {
                  if (currentRole === 'ROLE_PROVIDER') setCurrentPage('provider-dashboard');
                  else if (currentRole === 'ROLE_ADMIN') setCurrentPage('admin-dashboard');
                  else setCurrentPage('customer-dashboard');
                }}
              >
                <LayoutDashboard size={15} className="me-1" /> Dashboard
              </button>
            </li>
          </ul>

          {/* Right Action Bar */}
          <div className="d-flex align-items-center gap-2">
            {/* Emergency Service Button */}
            <button className="btn btn-emergency d-flex align-items-center gap-1" onClick={onOpenEmergency}>
              <Zap size={16} fill="currentColor" /> 24/7 Emergency
            </button>

            {/* Role Selector Switcher */}
            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle btn-sm rounded-pill px-3 fw-semibold" type="button" data-bs-toggle="dropdown">
                Role: {currentRole === 'ROLE_ADMIN' ? 'Admin' : currentRole === 'ROLE_PROVIDER' ? 'Provider' : 'Customer'}
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                <li>
                  <button className="dropdown-item py-2 fw-medium" onClick={() => { setCurrentRole('ROLE_CUSTOMER'); setCurrentPage('customer-dashboard'); }}>
                    👤 Customer View
                  </button>
                </li>
                <li>
                  <button className="dropdown-item py-2 fw-medium" onClick={() => { setCurrentRole('ROLE_PROVIDER'); setCurrentPage('provider-dashboard'); }}>
                    🔧 Service Provider View
                  </button>
                </li>
                <li>
                  <button className="dropdown-item py-2 fw-medium" onClick={() => { setCurrentRole('ROLE_ADMIN'); setCurrentPage('admin-dashboard'); }}>
                    🛡️ Admin Control Panel
                  </button>
                </li>
              </ul>
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="dropdown">
                <button className="btn btn-fixmate-primary btn-sm rounded-pill px-3" type="button" data-bs-toggle="dropdown">
                  <UserCheck size={16} className="me-1" /> {user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                  <li><button className="dropdown-item" onClick={() => setCurrentPage(currentRole === 'ROLE_PROVIDER' ? 'provider-dashboard' : 'customer-dashboard')}>Dashboard</button></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={() => window.location.reload()}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold" onClick={() => setCurrentPage('login')}>
                  Login
                </button>
                <button className="btn btn-fixmate-primary btn-sm rounded-pill px-3 fw-semibold" onClick={() => setCurrentPage('register')}>
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
