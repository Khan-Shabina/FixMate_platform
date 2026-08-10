import React from 'react';
import { Users, ShieldCheck, CheckCircle2, DollarSign, Activity, FileText } from 'lucide-react';
import { mockProviders, mockBookings } from '../data/mockData';

export default function AdminDashboard({ setCurrentPage, user }) {
  return (
    <div className="container py-5">
      {/* Header */}
      <div className="bg-fixmate-dark text-white p-4 p-md-5 rounded-4 shadow-sm mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge bg-danger text-white fw-bold mb-2">Admin Control Center</span>
            <h2 className="fw-extrabold text-white mb-1">Welcome, {user?.name || 'Admin'} 👋</h2>
            <p className="text-light opacity-75 mb-0">System monitor for active customers, verified service providers, and platform bookings.</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <button className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm" onClick={() => setCurrentPage('provider-verification')}>
              <ShieldCheck size={18} className="me-1 d-inline" /> Pending Verifications (1)
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-5 text-center">
        <div className="col-md-3">
          <div className="card card-fixmate p-4">
            <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-3 mx-auto mb-2" style={{ width: '56px', height: '56px' }}>
              <Users size={24} />
            </div>
            <h3 className="fw-extrabold text-dark mb-0">1,248</h3>
            <span className="text-muted small">Registered Users</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card card-fixmate p-4">
            <div className="rounded-circle bg-success bg-opacity-10 text-success p-3 mx-auto mb-2" style={{ width: '56px', height: '56px' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 className="fw-extrabold text-dark mb-0">340</h3>
            <span className="text-muted small">Verified Technicians</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card card-fixmate p-4">
            <div className="rounded-circle bg-warning bg-opacity-10 text-warning p-3 mx-auto mb-2" style={{ width: '56px', height: '56px' }}>
              <CheckCircle2 size={24} />
            </div>
            <h3 className="fw-extrabold text-dark mb-0">48,210</h3>
            <span className="text-muted small">Total Bookings</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card card-fixmate p-4">
            <div className="rounded-circle bg-info bg-opacity-10 text-info p-3 mx-auto mb-2" style={{ width: '56px', height: '56px' }}>
              <DollarSign size={24} />
            </div>
            <h3 className="fw-extrabold text-dark mb-0">₹12.4L</h3>
            <span className="text-muted small">Platform Revenue</span>
          </div>
        </div>
      </div>

      {/* Verification & System Logs */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card card-fixmate p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-dark mb-0">Worker Verification Queue</h5>
              <button className="btn btn-link p-0 text-primary small fw-bold text-decoration-none" onClick={() => setCurrentPage('provider-verification')}>
                Manage Queue →
              </button>
            </div>

            {mockProviders.slice(2).map((p) => (
              <div key={p.id} className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  <img src={p.img} alt={p.name} className="rounded-circle" style={{ width: '48px', height: '48px' }} />
                  <div>
                    <h6 className="fw-bold text-dark mb-0">{p.name}</h6>
                    <small className="text-muted">{p.role} • {p.location}</small>
                  </div>
                </div>
                <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold">PENDING</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card card-fixmate p-4">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Activity size={20} className="text-primary" /> Live Activity Feed
            </h5>
            <ul className="list-unstyled small text-muted mb-0 d-grid gap-2">
              <li className="p-2 bg-light rounded border-start border-3 border-success">
                <strong>New Booking #FM-2841:</strong> Master Electrical Repair requested by Sumit Shelar.
              </li>
              <li className="p-2 bg-light rounded border-start border-3 border-warning">
                <strong>Emergency Priority Alert:</strong> Dispatched to Rahul Sharma (Andheri East).
              </li>
              <li className="p-2 bg-light rounded border-start border-3 border-primary">
                <strong>Society Group Deal:</strong> Green Valley Society crossed 14 joined members.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
