import React, { useState, useEffect } from 'react';
import { ListCheck, Wrench, ShieldCheck, CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';
import { apiService } from '../services/api';

export default function ProviderDashboard({ setCurrentPage, user }) {
  const [provider, setProvider] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadProviderData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const userId = user?.userId || user?.id;
      let pData = null;
      if (userId) {
        const pRes = await apiService.getProviderByUserId(userId);
        if (pRes.success && pRes.data) {
          pData = pRes.data;
        }
      }

      if (!pData) {
        // Fallback: search by email/user
        const all = await apiService.getProviders();
        if (Array.isArray(all) && all.length > 0) {
          pData = all.find(p => p.userId === userId || p.email === user?.email) || all[0];
        }
      }

      if (pData) {
        setProvider(pData);
        const pId = pData.providerId || pData.id;
        const bList = await apiService.getProviderBookings(pId);
        if (Array.isArray(bList)) {
          setBookings(bList);
        }
      }
    } catch {
      setErrorMsg('Failed to load provider data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviderData();
  }, [user]);

  const handleToggleAvailability = async () => {
    if (!provider) return;
    const pId = provider.providerId || provider.id;
    const newStatus = !provider.isAvailable;
    setToggling(true);
    setActionMsg('');
    const res = await apiService.updateProviderAvailability(pId, newStatus);
    setToggling(false);
    if (res.success) {
      setProvider(prev => ({ ...prev, isAvailable: newStatus }));
      setActionMsg(`Your status is now ${newStatus ? 'AVAILABLE for incoming requests' : 'OFF-DUTY / BUSY'}.`);
    } else {
      setErrorMsg(res.error || 'Failed to update availability');
    }
  };

  const completedCount = bookings.filter(b => (b.status || '').toUpperCase() === 'COMPLETED').length;
  const pendingCount = bookings.filter(b => (b.status || '').toUpperCase() === 'REQUESTED').length;
  const activeCount = bookings.filter(b => ['ACCEPTED', 'IN_PROGRESS'].includes((b.status || '').toUpperCase())).length;

  return (
    <div className="container py-5">
      {/* Header Banner */}
      <div className="bg-fixmate-navy text-white p-4 p-md-5 rounded-4 shadow-sm mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge bg-info text-dark fw-bold mb-2">Service Provider Portal</span>
            <h2 className="fw-extrabold text-white mb-1">{provider?.name || user?.name || 'Service Provider'}</h2>
            <p className="text-light opacity-75 mb-0">
              Location: <strong>{provider?.location || 'City Center'}</strong> | Experience: <strong>{provider?.experience || 'Skilled'}</strong> | Trust Score: <span className="text-warning fw-bold">{provider?.trustScore || 85}%</span>
            </p>
          </div>

          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            {/* Availability Toggle */}
            <div className="bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-20 d-inline-block text-start">
              <span className="small text-white-50 d-block mb-1">Availability Status</span>
              <button 
                className={`btn btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-2 ${provider?.isAvailable ? 'btn-success' : 'btn-danger'}`}
                onClick={handleToggleAvailability}
                disabled={toggling || !provider}
              >
                {toggling ? 'Updating...' : provider?.isAvailable ? '🟢 Available Now' : '🔴 Busy / Off-Duty'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {actionMsg && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
          <CheckCircle2 size={18} /> {actionMsg}
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="row g-4 mb-4 text-center">
        <div className="col-md-3 col-6">
          <div className="card card-fixmate p-3">
            <h3 className="fw-extrabold text-success mb-1">{completedCount}</h3>
            <span className="text-muted small">Completed Jobs</span>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card card-fixmate p-3">
            <h3 className="fw-extrabold text-warning mb-1">{pendingCount}</h3>
            <span className="text-muted small">Pending Requests</span>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card card-fixmate p-3">
            <h3 className="fw-extrabold text-primary mb-1">{activeCount}</h3>
            <span className="text-muted small">Active In-Progress</span>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card card-fixmate p-3">
            <h3 className="fw-extrabold text-info mb-1">{provider?.trustScore || 85}%</h3>
            <span className="text-muted small">Community Trust Score</span>
          </div>
        </div>
      </div>

      {/* Worker Empowerment Notice */}
      <div className="alert alert-primary bg-primary bg-opacity-10 border-primary border-opacity-25 p-3 rounded-4 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h6 className="fw-bold text-primary mb-0">🔧 Grow your local business with FixMate</h6>
          <small className="text-muted">Direct neighbor bookings, transparent algorithmic trust scoring, and fair earnings.</small>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-fixmate-primary btn-sm rounded-pill px-3 fw-bold" onClick={() => setCurrentPage('provider-bookings')}>
            <ListCheck size={16} className="me-1 d-inline" /> Manage All Jobs ({bookings.length})
          </button>
          <button className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-bold" onClick={() => setCurrentPage('manage-services')}>
            <Wrench size={16} className="me-1 d-inline" /> Services Catalog
          </button>
        </div>
      </div>

      {/* Incoming Booking Requests */}
      <div className="card card-fixmate p-4 shadow-sm border-0">
        <h5 className="fw-bold text-dark mb-3">Customer Job Queue</h5>
        {loading ? (
          <div className="text-center py-4 text-muted">
            <div className="spinner-border spinner-border-sm me-2 text-primary"></div> Loading assigned requests...
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-4 text-muted">
            No booking requests currently assigned. Make sure your availability status is set to <strong>🟢 Available Now</strong>.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Booking ID</th>
                  <th>Service Name</th>
                  <th>Customer Address</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.bookingId}>
                    <td className="fw-bold">FM-{b.bookingId}</td>
                    <td>{b.service?.serviceName || 'Maintenance'}</td>
                    <td className="small">{b.address}</td>
                    <td className="small">{b.bookingDate ? b.bookingDate.split('T')[0] : ''}</td>
                    <td>
                      <span className={`badge ${b.status === 'COMPLETED' ? 'bg-success' : b.status === 'ACCEPTED' ? 'bg-primary' : b.status === 'IN_PROGRESS' ? 'bg-info' : 'bg-warning text-dark'} rounded-pill`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      {b.emergencyFlag ? (
                        <span className="badge bg-danger rounded-pill d-flex align-items-center gap-1 w-fit">
                          <Zap size={11} fill="currentColor" /> Emergency
                        </span>
                      ) : (
                        <span className="badge bg-secondary rounded-pill">Standard</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary rounded-pill fw-bold" onClick={() => setCurrentPage('provider-bookings')}>
                        Manage Job
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
