import React from 'react';
import fixmateLogo from '../assets/fixmate-logo.jpeg';
import { PhoneCall, ShieldCheck, Heart } from 'lucide-react';

const teamMembers = [
  { name: 'Shabina Khan', role: 'Dev' },
  { name: 'Shankar Sala', role: 'Dev' },
  { name: 'Siddhi Patil', role: 'Dev' },
  { name: 'Sumit Shelar', role: 'Dev' }
];

export default function Footer({ setCurrentPage }) {
  return (
    <footer className="bg-fixmate-dark text-white pt-5 pb-4 mt-5 border-top border-secondary border-opacity-25">
      <div className="container">
        <div className="row g-4 mb-5">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img
                src={fixmateLogo}
                alt="FixMate Logo"
                className="rounded-circle border border-2 border-white shadow-sm"
                style={{ width: '44px', height: '44px', objectFit: 'cover' }}
              />
              <div className="lh-sm">
                <div className="fs-4 fw-extrabold text-white">
                  Fix<span className="text-warning">Mate</span>
                </div>
                <small
                  className="d-block text-white-50"
                  style={{ fontSize: '0.7rem', marginTop: '-2px' }}
                >
                  Smart Local Services
                </small>
              </div>
            </div>

            <p className="text-white-50 small leading-relaxed mb-4" style={{ maxWidth: '340px' }}>
              FixMate is a smart local service & emergency booking platform empowering skilled professionals while offering instant, verified, and reliable home services to communities.
            </p>

            <div
              className="d-flex align-items-center gap-3 bg-white bg-opacity-10 p-3 rounded-4 border border-warning border-opacity-25 footer-emergency-card"
              style={{ maxWidth: '300px' }}
            >
              <div className="bg-warning bg-opacity-20 p-2 rounded-circle text-warning shrink-0 d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                <PhoneCall size={20} className="text-warning" />
              </div>
              <div>
                <span className="d-block text-white-50 text-uppercase fw-semibold" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                  Emergency Support 24/7
                </span>
                <span className="fs-6 text-warning fw-extrabold">+91 1800-FIX-MATE</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase tracking-wider fs-6">Navigation</h6>
            <ul className="list-unstyled small d-grid gap-2 mb-0">
              <li>
                <button
                  className="btn btn-link p-0 footer-link text-start"
                  onClick={() => setCurrentPage('home')}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 footer-link text-start"
                  onClick={() => setCurrentPage('services')}
                >
                  Services Catalog
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 footer-link text-start"
                  onClick={() => setCurrentPage('providers')}
                >
                  Local Workers
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 footer-link text-start"
                  onClick={() => setCurrentPage('reminders')}
                >
                  Maintenance Reminders
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 footer-link text-start"
                  onClick={() => setCurrentPage('society')}
                >
                  Society Group Booking
                </button>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase tracking-wider fs-6">User Portals</h6>
            <ul className="list-unstyled small d-grid gap-2 mb-0">
              <li>
                <button
                  className="btn btn-link p-0 footer-link text-start"
                  onClick={() => setCurrentPage('customer-dashboard')}
                >
                  Customer Dashboard
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 footer-link text-start"
                  onClick={() => setCurrentPage('provider-dashboard')}
                >
                  Service Provider Hub
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 footer-link text-start"
                  onClick={() => setCurrentPage('manage-services')}
                >
                  Manage Offered Services
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 footer-link text-start"
                  onClick={() => setCurrentPage('admin-dashboard')}
                >
                  Admin Analytics
                </button>
              </li>
              <li>
                <button
                  className="btn btn-link p-0 footer-link text-start"
                  onClick={() => setCurrentPage('provider-verification')}
                >
                  Worker Verification Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Project Team Members */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase tracking-wider fs-6">Project Team Members</h6>
            <div className="bg-white bg-opacity-10 p-3 rounded-4 border border-white border-opacity-10 shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2 pb-2 border-bottom border-white border-opacity-10">
                <ShieldCheck size={18} className="text-warning shrink-0" />
                <span className="fw-bold small text-white">FixMate Development Group</span>
              </div>
              <ul className="list-unstyled small mb-0 d-grid gap-2">
                {teamMembers.map((member, idx) => (
                  <li key={idx} className="d-flex align-items-center justify-content-between text-white-50">
                    <span>{idx + 1}. {member.name}</span>
                    <span className="badge bg-primary bg-opacity-40 text-white rounded-pill px-2" style={{ fontSize: '0.65rem' }}>
                      Dev
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="border-secondary opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-white-50 small gap-2">
          <div>
            &copy; 2026 FixMate Platform. Designed with <Heart size={14} className="text-danger d-inline mx-1" fill="currentColor" /> for Smart Communities & Empowered Local Skilled Workers.
          </div>
        </div>
      </div>
    </footer>
  );
}
