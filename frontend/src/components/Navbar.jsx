import React from 'react';
import fixmateLogo from '../assets/fixmate-logo.jpeg';

import {
  Zap,
  UserCheck,
  Calendar,
  Users,
  LayoutDashboard,
  LogOut
} from 'lucide-react';

export default function Navbar({
  currentPage,
  setCurrentPage,
  currentRole,
  onOpenEmergency,
  user,
  onLogout
}) {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-2">
      <div className="container-fluid px-4 d-flex align-items-center">

        {/* Brand Logo */}
        <button
          className="navbar-brand d-flex align-items-center gap-2 border-0 bg-transparent text-start p-0 me-4"
          onClick={() => setCurrentPage('home')}
        >
          <img
            src={fixmateLogo}
            alt="FixMate Logo"
            className="rounded-circle"
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'cover'
            }}
          />

          <div className="lh-sm">
            <div className="fs-5 fw-normal">
              Fix<span className="text-warning">Mate</span>
            </div>

            <small
              className="d-block text-muted"
              style={{ fontSize: '0.68rem', marginTop: '-2px' }}
            >
              Smart Local Services
            </small>
          </div>
        </button>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#fixmateNav"
          aria-controls="fixmateNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Content */}
        <div
          className="collapse navbar-collapse align-items-center"
          id="fixmateNav"
        >

          {/* Main Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-semibold d-flex align-items-center">

            {/* Home */}
            <li className="nav-item">
              <button
                className={`nav-link text-nowrap border-0 bg-transparent px-2 d-flex align-items-center ${currentPage === 'home'
                    ? 'text-primary active fw-bold'
                    : 'text-secondary'
                  }`}
                onClick={() => setCurrentPage('home')}
              >
                Home
              </button>
            </li>

            {/* Services */}
            <li className="nav-item">
              <button
                className={`nav-link text-nowrap border-0 bg-transparent px-2 d-flex align-items-center ${currentPage === 'services'
                    ? 'text-primary active fw-bold'
                    : 'text-secondary'
                  }`}
                onClick={() => setCurrentPage('services')}
              >
                Services
              </button>
            </li>

            {/* Providers */}
            <li className="nav-item">
              <button
                className={`nav-link text-nowrap border-0 bg-transparent px-2 d-flex align-items-center ${currentPage === 'providers'
                    ? 'text-primary active fw-bold'
                    : 'text-secondary'
                  }`}
                onClick={() => setCurrentPage('providers')}
              >
                Providers
              </button>
            </li>

            {/* Customer Only Pages */}
            {currentRole === 'ROLE_CUSTOMER' && (
              <>
                {/* Reminders */}
                <li className="nav-item">
                  <button
                    className={`nav-link text-nowrap border-0 bg-transparent px-2 d-flex align-items-center ${currentPage === 'reminders'
                        ? 'text-primary active fw-bold'
                        : 'text-secondary'
                      }`}
                    onClick={() => setCurrentPage('reminders')}
                  >
                    <Calendar
                      size={15}
                      className="me-1 flex-shrink-0"
                    />
                    Reminders
                  </button>
                </li>

                {/* Society Booking */}
                <li className="nav-item">
                  <button
                    className={`nav-link text-nowrap border-0 bg-transparent px-2 d-flex align-items-center ${currentPage === 'society'
                        ? 'text-primary active fw-bold'
                        : 'text-secondary'
                      }`}
                    onClick={() => setCurrentPage('society')}
                  >
                    <Users
                      size={15}
                      className="me-1 flex-shrink-0"
                    />
                    Society Booking
                  </button>
                </li>
              </>
            )}

            {/* Dashboard */}
            {user && (
              <li className="nav-item">
                <button
                  className={`nav-link text-nowrap border-0 bg-transparent px-2 d-flex align-items-center ${currentPage.includes('dashboard')
                      ? 'text-primary active fw-bold'
                      : 'text-secondary'
                    }`}
                  onClick={() => {
                  const role = user?.role;
                  if (role === 'ROLE_PROVIDER' || role === 'PROVIDER') {
                    setCurrentPage('provider-dashboard');
                  } else if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
                    setCurrentPage('admin-dashboard');
                  } else {
                    setCurrentPage('customer-dashboard');
                  }
                }}
                >
                  <LayoutDashboard
                    size={15}
                    className="me-1 flex-shrink-0"
                  />
                  Dashboard
                </button>
              </li>
            )}
          </ul>

          {/* Right Action Bar */}
          <div className="d-flex align-items-center gap-2 flex-nowrap">

            {/* Emergency Button */}
            <button
              className="btn btn-emergency d-flex align-items-center gap-1 text-nowrap"
              onClick={onOpenEmergency}
            >
              <Zap size={16} fill="currentColor" />
              24/7 Emergency
            </button>

            {/* Role Badge for Logged In User */}
            {user && (
              <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-semibold text-nowrap">
                Role: {user.role === 'ROLE_ADMIN' ? '🛡️ Admin' : user.role === 'ROLE_PROVIDER' ? '🔧 Provider' : '👤 Customer'}
              </span>
            )}

            {/* User Dropdown or Login / Register */}
            {user ? (
              <div className="dropdown">

                <button
                  className="btn btn-fixmate-primary btn-sm rounded-pill px-3 text-nowrap"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <UserCheck
                    size={16}
                    className="me-1"
                  />
                  {user.name}
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow border-0">

                  <li>
                    <button
                      className="dropdown-item py-2 fw-medium"
                      onClick={() =>
                        setCurrentPage(
                          currentRole === 'ROLE_PROVIDER'
                            ? 'provider-dashboard'
                            : currentRole === 'ROLE_ADMIN'
                              ? 'admin-dashboard'
                              : 'customer-dashboard'
                        )
                      }
                    >
                      <LayoutDashboard
                        size={14}
                        className="me-2 text-muted"
                      />
                      Dashboard
                    </button>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      className="dropdown-item text-danger py-2 fw-medium"
                      onClick={onLogout}
                    >
                      <LogOut
                        size={14}
                        className="me-2"
                      />
                      Logout
                    </button>
                  </li>

                </ul>
              </div>
            ) : (
              /* Login / Register */
              <div className="d-flex gap-2 flex-nowrap">

                <button
                  className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold text-nowrap"
                  onClick={() => setCurrentPage('login')}
                >
                  Login
                </button>

                <button
                  className="btn btn-fixmate-primary btn-sm rounded-pill px-3 fw-semibold text-nowrap"
                  onClick={() => setCurrentPage('register')}
                >
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