import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, CheckCircle2, DollarSign, Activity, FileText } from 'lucide-react';
import { apiService } from '../services/api';

export default function AdminDashboard({ setCurrentPage, user }) {
  const [providers, setProviders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [provList, statsData] = await Promise.all([
        apiService.getProviders(),
        apiService.getAdminStats()
      ]);
      
      if (Array.isArray(provList)) {
        setProviders(provList);
      }
      if (statsData) {
        setStats(statsData);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const pendingProviders = providers.filter(p => p.verificationStatus === 'PENDING' || p.verified === false);
  const pendingCount = stats?.pendingVerifications !== undefined ? stats.pendingVerifications : pendingProviders.length;

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="bg-fixmate-dark text-white p-4 p-md-5 rounded-4 shadow-sm mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge bg-danger text-white fw-bold mb-2">Admin Control Center</span>
            <h2 className="fw-extrabold text-white mb-1">Welcome, {user?.name || 'System Administrator'} 👋</h2>
            <p className="text-light opacity-75 mb-0">System monitor for active customers, verified service providers, and platform bookings.</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <button className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm" onClick={() => setCurrentPage('provider-verification')}>
              <ShieldCheck size={18} className="me-1 d-inline" /> Pending Verifications ({pendingCount})
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
            <h3 className="fw-extrabold text-dark mb-0">{stats?.totalUsers !== undefined ? stats.totalUsers : 0}</h3>
            <span className="text-muted small">Registered Users</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card card-fixmate p-4">
            <div className="rounded-circle bg-success bg-opacity-10 text-success p-3 mx-auto mb-2" style={{ width: '56px', height: '56px' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 className="fw-extrabold text-dark mb-0">{stats?.totalProviders !== undefined ? stats.totalProviders : 0}</h3>
            <span className="text-muted small">Registered Technicians</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card card-fixmate p-4">
            <div className="rounded-circle bg-warning bg-opacity-10 text-warning p-3 mx-auto mb-2" style={{ width: '56px', height: '56px' }}>
              <CheckCircle2 size={24} />
            </div>
            <h3 className="fw-extrabold text-dark mb-0">{stats?.totalBookings !== undefined ? stats.totalBookings : 0}</h3>
            <span className="text-muted small">Total Bookings</span>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card card-fixmate p-4">
            <div className="rounded-circle bg-info bg-opacity-10 text-info p-3 mx-auto mb-2" style={{ width: '56px', height: '56px' }}>
              <DollarSign size={24} />
            </div>
            <h3 className="fw-extrabold text-dark mb-0">{stats?.pendingVerifications !== undefined ? stats.pendingVerifications : 0}</h3>
            <span className="text-muted small">Pending Verifications</span>
          </div>
        </div>
      </div>

      {/* Verification & System Logs */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card card-fixmate p-4 h-100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-dark mb-0">Worker Verification Queue</h5>
              <button className="btn btn-link p-0 text-primary small fw-bold text-decoration-none" onClick={() => setCurrentPage('provider-verification')}>
                Manage Queue →
              </button>
            </div>

            {pendingProviders.length === 0 ? (
              <div className="p-4 bg-light rounded-3 text-center text-muted small">
                <CheckCircle2 size={24} className="text-success mx-auto mb-2 d-block" />
                No pending provider verification requests at this time.
              </div>
            ) : (
              pendingProviders.map((p) => (
                <div key={p.id || p.providerId} className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-2 fw-bold text-center" style={{ width: '42px', height: '42px', lineHeight: '26px' }}>
                      {(p.name || p.user?.name || 'P')[0]}
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0">{p.name || p.user?.name}</h6>
                      <small className="text-muted">{p.role || p.category || 'Provider'} • {p.location || 'Location'}</small>
                    </div>
                  </div>
                  <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold">PENDING</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card card-fixmate p-4 h-100">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Activity size={20} className="text-primary" /> Platform Status & Overview
            </h5>
            <div className="bg-light p-3 rounded-3 border mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
                <span className="small text-muted">API Server:</span>
                <span className="badge bg-success bg-opacity-10 text-success fw-bold">ONLINE (Port 8080)</span>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
                <span className="small text-muted">Database Connection:</span>
                <span className="badge bg-success bg-opacity-10 text-success fw-bold">CONNECTED</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span className="small text-muted">Authentication:</span>
                <span className="badge bg-primary bg-opacity-10 text-primary fw-bold">JWT Secure</span>
              </div>
            </div>
            <button className="btn btn-outline-secondary btn-sm w-100 rounded-pill" onClick={() => setCurrentPage('manage-services')}>
              Manage Service Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
