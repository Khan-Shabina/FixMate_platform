import React, { useState } from 'react';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Handle dashboard navigation based on role
  const handleDashboardClick = () => {
    const role = user?.role;

    if (role === 'ROLE_PROVIDER' || role === 'PROVIDER') {
      setCurrentPage('provider-dashboard');
    } else if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
      setCurrentPage('admin-dashboard');
    } else {
      setCurrentPage('customer-dashboard');
    }
  };

  return (
      <nav className="navbar navbar-expand-lg bg-white shadow-sm py-2">
        <div className="container-fluid px-4 d-flex align-items-center">

          {/* =========================
            BRAND LOGO
        ========================== */}
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
                  style={{
                    fontSize: '0.68rem',
                    marginTop: '-2px'
                  }}
              >
                Smart Local Services
              </small>
            </div>
          </button>

          {/* =========================
            MOBILE TOGGLE
        ========================== */}
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

          {/* =========================
            NAV CONTENT
        ========================== */}
          <div
              className="collapse navbar-collapse align-items-center"
              id="fixmateNav"
          >

            {/* =========================
              MAIN NAVIGATION
          ========================== */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-semibold d-flex align-items-center">

              {/* HOME */}
              <li className="nav-item">
                <button
                    type="button"
                    className={`nav-link fixmate-nav-link text-nowrap border-0 bg-transparent d-flex align-items-center ${
                        currentPage === 'home'
                            ? 'text-primary active fw-bold'
                            : 'text-secondary'
                    }`}
                    onClick={() => setCurrentPage('home')}
                >
                  Home
                </button>
              </li>

              {/* SERVICES */}
              <li className="nav-item">
                <button
                    type="button"
                    className={`nav-link fixmate-nav-link text-nowrap border-0 bg-transparent d-flex align-items-center ${
                        currentPage === 'services'
                            ? 'text-primary active fw-bold'
                            : 'text-secondary'
                    }`}
                    onClick={() => setCurrentPage('services')}
                >
                  Services
                </button>
              </li>

              {/* PROVIDERS */}
              <li className="nav-item">
                <button
                    type="button"
                    className={`nav-link fixmate-nav-link text-nowrap border-0 bg-transparent d-flex align-items-center ${
                        currentPage === 'providers'
                            ? 'text-primary active fw-bold'
                            : 'text-secondary'
                    }`}
                    onClick={() => setCurrentPage('providers')}
                >
                  Providers
                </button>
              </li>

              {/* =========================
                CUSTOMER ONLY PAGES
            ========================== */}
              {currentRole === 'ROLE_CUSTOMER' && (
                  <>
                    {/* REMINDERS */}
                    <li className="nav-item">
                      <button
                          type="button"
                          className={`nav-link fixmate-nav-link text-nowrap border-0 bg-transparent d-flex align-items-center ${
                              currentPage === 'reminders'
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

                    {/* SOCIETY BOOKING */}
                    <li className="nav-item">
                      <button
                          type="button"
                          className={`nav-link fixmate-nav-link text-nowrap border-0 bg-transparent d-flex align-items-center ${
                              currentPage === 'society'
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

              {/* =========================
                DASHBOARD
            ========================== */}
              {user && (
                  <li className="nav-item">
                    <button
                        type="button"
                        className={`nav-link fixmate-nav-link text-nowrap border-0 bg-transparent d-flex align-items-center ${
                            currentPage.includes('dashboard')
                                ? 'text-primary active fw-bold'
                                : 'text-secondary'
                        }`}
                        onClick={handleDashboardClick}
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

            {/* =========================
              RIGHT ACTION BAR
          ========================== */}
            <div className="d-flex align-items-center gap-2 flex-wrap flex-lg-nowrap navbar-action-group mt-2 mt-lg-0">

              {/* EMERGENCY BUTTON */}
              <button
                  type="button"
                  className="btn btn-emergency d-flex align-items-center gap-1 text-nowrap"
                  onClick={onOpenEmergency}
              >
                <Zap
                    size={16}
                    fill="currentColor"
                />
                24/7 Emergency
              </button>

              {/* ROLE BADGE */}
              {user && (
                  <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-semibold text-nowrap">
                Role:{' '}
                    {user.role === 'ROLE_ADMIN' || user.role === 'ADMIN'
                        ? '🛡️ Admin'
                        : user.role === 'ROLE_PROVIDER' ||
                        user.role === 'PROVIDER'
                            ? '🔧 Provider'
                            : '👤 Customer'}
              </span>
              )}

              {/* =========================
                LOGGED IN USER
            ========================== */}
              {user ? (
                  <div className="d-flex align-items-center gap-2 flex-wrap flex-sm-nowrap">

                    {/* USER BUTTON + DROPDOWN */}
                    <div className="position-relative">
                      <button
                          type="button"
                          className="btn btn-fixmate-primary btn-sm rounded-pill px-3 text-nowrap d-flex align-items-center gap-1"
                          onClick={() => setUserMenuOpen(!userMenuOpen)}
                      >
                        <UserCheck size={16} />
                        {user.name}
                      </button>

                      {userMenuOpen && (
                          <div
                              className="position-absolute end-0 mt-2 bg-white shadow-lg rounded-3 border p-2"
                              style={{
                                minWidth: '180px',
                                zIndex: 1050
                              }}
                          >
                            {/* Dashboard */}
                            <button
                                type="button"
                                className="dropdown-item py-2 fw-medium rounded-2 text-start d-flex align-items-center gap-2 w-100 btn border-0"
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  handleDashboardClick();
                                }}
                            >
                              <LayoutDashboard
                                  size={14}
                                  className="text-muted"
                              />
                              Dashboard
                            </button>

                            <hr className="my-1" />

                            {/* Logout */}
                            <button
                                type="button"
                                className="dropdown-item text-danger py-2 fw-medium rounded-2 text-start d-flex align-items-center gap-2 w-100 btn border-0"
                                onClick={() => {
                                  setUserMenuOpen(false);
                                  onLogout();
                                }}
                            >
                              <LogOut size={14} />
                              Logout
                            </button>
                          </div>
                      )}
                    </div>

                    {/* DIRECT LOGOUT BUTTON */}
                    <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold text-nowrap d-flex align-items-center gap-1"
                        onClick={onLogout}
                        title="Logout from Account"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
              ) : (
                  /* =========================
                     LOGIN / REGISTER
                  ========================== */
                  <div className="d-flex gap-2 flex-wrap flex-sm-nowrap">

                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold text-nowrap"
                        onClick={() => setCurrentPage('login')}
                    >
                      Login
                    </button>

                    <button
                        type="button"
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