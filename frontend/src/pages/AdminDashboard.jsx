import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, CheckCircle2, DollarSign, Activity, AlertCircle, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';

export default function AdminDashboard({ setCurrentPage, user }) {
  const [providers, setProviders] = useState([]);
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [provList, statsData, allBookings, allUsers] = await Promise.all([
        apiService.getProviders(),
        apiService.getAdminStats(),
        apiService.getAllBookings(),
        apiService.getAllUsers()
      ]);
      
      if (Array.isArray(provList)) {
        setProviders(provList);
      }
      if (statsData) {
        setStats(statsData);
      }
      if (Array.isArray(allBookings)) {
        setBookings(allBookings);
      }
      if (Array.isArray(allUsers)) {
        setUsersList(allUsers);
      }
    } catch {
      setErrorMsg('Failed to load admin telemetry data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingProviders = providers.filter(p => p.verificationStatus === 'PENDING' || p.verified === false);
  const pendingCount = stats?.pendingVerifications !== undefined ? stats.pendingVerifications : pendingProviders.length;
  const totalUsersCount = stats?.totalUsers !== undefined ? stats.totalUsers : usersList.length;
  const totalProvidersCount = stats?.totalProviders !== undefined ? stats.totalProviders : providers.length;
  const totalBookingsCount = stats?.totalBookings !== undefined ? stats.totalBookings : bookings.length;

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="bg-fixmate-dark text-white p-4 p-md-5 rounded-4 shadow-sm mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge bg-danger text-white fw-bold mb-2">Admin Control Center</span>
            <h2 className="fw-extrabold text-white mb-1">Welcome, {user?.name || 'System Administrator'} 👋</h2>
            <p className="text-light opacity-75 mb-0">Platform monitor for active users, verified service providers, and operational bookings.</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-md-end flex-wrap">
            <button className="btn btn-warning rounded-pill px-4 fw-bold shadow-sm" onClick={() => setCurrentPage('provider-verification')}>
              <ShieldCheck size={18} className="me-1 d-inline" /> Pending Verifications ({pendingCount})
            </button>
            <button className="btn btn-outline-light rounded-pill px-4 fw-bold" onClick={() => setCurrentPage('manage-services')}>
              Services Catalog
            </button>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {/* Metrics Row */}
      <div className="row g-4 mb-5 text-center">
        <div className="col-md-3 col-6">
          <div className="card card-fixmate p-4">
            <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-3 mx-auto mb-2" style={{ width: '56px', height: '56px' }}>
              <Users size={24} />
            </div>
            <h3 className="fw-extrabold text-dark mb-0">{loading ? '...' : totalUsersCount}</h3>
            <span className="text-muted small">Registered Users</span>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card card-fixmate p-4">
            <div className="rounded-circle bg-success bg-opacity-10 text-success p-3 mx-auto mb-2" style={{ width: '56px', height: '56px' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 className="fw-extrabold text-dark mb-0">{loading ? '...' : totalProvidersCount}</h3>
            <span className="text-muted small">Service Technicians</span>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card card-fixmate p-4">
            <div className="rounded-circle bg-warning bg-opacity-10 text-warning p-3 mx-auto mb-2" style={{ width: '56px', height: '56px' }}>
              <CheckCircle2 size={24} />
            </div>
            <h3 className="fw-extrabold text-dark mb-0">{loading ? '...' : totalBookingsCount}</h3>
            <span className="text-muted small">Total Bookings</span>
          </div>
        </div>

        <div className="col-md-3 col-6">
          <div className="card card-fixmate p-4">
            <div className="rounded-circle bg-info bg-opacity-10 text-info p-3 mx-auto mb-2" style={{ width: '56px', height: '56px' }}>
              <Activity size={24} />
            </div>
            <h3 className="fw-extrabold text-dark mb-0">{loading ? '...' : pendingCount}</h3>
            <span className="text-muted small">Pending Approvals</span>
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

            {loading ? (
              <div className="text-center py-4 text-muted small">
                <div className="spinner-border spinner-border-sm me-2 text-primary"></div> Loading verification queue...
              </div>
            ) : pendingProviders.length === 0 ? (
              <div className="p-4 bg-light rounded-3 text-center text-muted small">
                <CheckCircle2 size={24} className="text-success mb-2 mx-auto d-block" /> All service provider applications are verified. No pending items.
              </div>
            ) : (
              pendingProviders.slice(0, 4).map((p) => (
                <div key={p.id || p.providerId} className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-3">
                    <img src={p.img || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop&crop=faces'} alt={p.name} className="rounded-circle" style={{ width: '44px', height: '44px' }} />
                    <div>
                      <h6 className="fw-bold text-dark mb-0">{p.name || p.user?.name}</h6>
                      <small className="text-muted">{p.experience || 'Skilled'} • {p.location || 'Local Area'}</small>
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
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <Activity size={20} className="text-primary" /> Live Operational Bookings
              </h5>
              <span className="badge bg-light text-secondary border">{bookings.length} Total</span>
            </div>

            {loading ? (
              <div className="text-center py-4 text-muted small">
                <div className="spinner-border spinner-border-sm me-2 text-primary"></div> Loading active bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-4 bg-light rounded-3 text-center text-muted small">
                No bookings recorded on the platform yet.
              </div>
            ) : (
              <div className="d-grid gap-2">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b.bookingId} className="p-2.5 bg-light rounded-3 border d-flex align-items-center justify-content-between">
                    <div>
                      <span className="fw-bold text-dark small">Booking #FM-{b.bookingId}: </span>
                      <span className="text-muted small">{b.service?.serviceName || 'Service'} ({b.customer?.name || 'Customer'})</span>
                    </div>
                    <span className={`badge ${b.status === 'COMPLETED' ? 'bg-success' : b.status === 'ACCEPTED' ? 'bg-primary' : b.status === 'IN_PROGRESS' ? 'bg-info' : 'bg-warning text-dark'} small`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
