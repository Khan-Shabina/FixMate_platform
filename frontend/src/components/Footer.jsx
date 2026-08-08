import React from 'react';
import { Wrench, PhoneCall, ShieldCheck, Heart, Code } from 'lucide-react';
import { mockTeamMembers } from '../data/mockData';

export default function Footer({ setCurrentPage }) {
  return (
    <footer className="bg-fixmate-dark text-white pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand Col */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="rounded-3 bg-fixmate-navy p-2 text-white">
                <Wrench size={22} className="text-fixmate-orange" />
              </div>
              <span className="fw-extrabold fs-3 text-white">Fix<span className="text-fixmate-orange">Mate</span></span>
            </div>
            <p className="text-light opacity-75 small leading-relaxed">
              FixMate is a smart local service & emergency booking platform empowering local skilled professionals while offering instant, verified, and reliable home services to communities.
            </p>
            <div className="d-flex align-items-center gap-2 text-warning fw-bold small bg-white bg-opacity-10 p-2 rounded-3 border border-warning border-opacity-25" style={{ maxWidth: '280px' }}>
              <PhoneCall size={18} className="text-fixmate-orange" />
              <div>
                <span className="d-block text-white-50 text-uppercase" style={{ fontSize: '0.65rem' }}>Emergency Support 24/7</span>
                <span className="fs-6 text-warning">+91 1800-FIX-MATE</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase tracking-wider fs-6">Navigation</h6>
            <ul className="list-unstyled small opacity-75 d-grid gap-2">
              <li><button className="btn btn-link text-white text-decoration-none p-0 opacity-75-hover" onClick={() => setCurrentPage('home')}>Home</button></li>
              <li><button className="btn btn-link text-white text-decoration-none p-0 opacity-75-hover" onClick={() => setCurrentPage('services')}>Services Catalog</button></li>
              <li><button className="btn btn-link text-white text-decoration-none p-0 opacity-75-hover" onClick={() => setCurrentPage('providers')}>Local Workers</button></li>
              <li><button className="btn btn-link text-white text-decoration-none p-0 opacity-75-hover" onClick={() => setCurrentPage('reminders')}>Maintenance Reminders</button></li>
              <li><button className="btn btn-link text-white text-decoration-none p-0 opacity-75-hover" onClick={() => setCurrentPage('society')}>Society Group Booking</button></li>
            </ul>
          </div>

          {/* User Roles */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase tracking-wider fs-6">User Portals</h6>
            <ul className="list-unstyled small opacity-75 d-grid gap-2">
              <li><button className="btn btn-link text-white text-decoration-none p-0 opacity-75-hover" onClick={() => setCurrentPage('customer-dashboard')}>Customer Dashboard</button></li>
              <li><button className="btn btn-link text-white text-decoration-none p-0 opacity-75-hover" onClick={() => setCurrentPage('provider-dashboard')}>Service Provider Hub</button></li>
              <li><button className="btn btn-link text-white text-decoration-none p-0 opacity-75-hover" onClick={() => setCurrentPage('manage-services')}>Manage Offered Services</button></li>
              <li><button className="btn btn-link text-white text-decoration-none p-0 opacity-75-hover" onClick={() => setCurrentPage('admin-dashboard')}>Admin Analytics</button></li>
              <li><button className="btn btn-link text-white text-decoration-none p-0 opacity-75-hover" onClick={() => setCurrentPage('provider-verification')}>Worker Verification Panel</button></li>
            </ul>
          </div>

          {/* Project Team Members */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase tracking-wider fs-6">Project Team Members</h6>
            <div className="bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-10">
              <div className="d-flex align-items-center gap-2 mb-2">
                <ShieldCheck size={18} className="text-fixmate-orange" />
                <span className="fw-bold small text-white">FixMate Development Group</span>
              </div>
              <ul className="list-unstyled small mb-0 opacity-90 d-grid gap-1">
                {mockTeamMembers.map((member, idx) => (
                  <li key={idx} className="d-flex align-items-center justify-content-between">
                    <span>{idx + 1}. {member.name}</span>
                    <span className="badge bg-primary bg-opacity-50 text-white" style={{ fontSize: '0.65rem' }}>Dev</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <hr className="border-secondary opacity-25 my-4" />

        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between text-white-50 small">
          <div>
            &copy; 2026 FixMate Platform. Designed with <Heart size={14} className="text-danger d-inline mx-1" fill="currentColor" /> for Smart Communities & Empowered Local Skilled Workers.
          </div>
        </div>
      </div>
    </footer>
  );
}
