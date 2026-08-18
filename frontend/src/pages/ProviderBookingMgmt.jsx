import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Zap, ArrowLeft } from 'lucide-react';
import { apiService } from '../services/api';

export default function ProviderBookingMgmt({ setCurrentPage, user }) {
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const userId = user?.userId || user?.id;
      let pId = null;
      if (userId) {
        const pRes = await apiService.getProviderByUserId(userId);
        if (pRes.success && pRes.data) {
          pId = pRes.data.providerId || pRes.data.id;
        }
      }

      if (!pId) {
        const all = await apiService.getProviders();
        if (Array.isArray(all) && all.length > 0) {
          const found = all.find(p => p.userId === userId || p.email === user?.email) || all[0];
          pId = found.providerId || found.id;
        }
      }

      if (pId) {
        const data = await apiService.getProviderBookings(pId);
        if (Array.isArray(data)) {
          setBookingList(data);
        }
      }
    } catch {
      setErrorMsg('Failed to load assigned bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const updateStatus = async (bookingId, newStatus) => {
    setErrorMsg('');
    setActionMsg('');
    setUpdatingId(bookingId);
    const result = await apiService.updateBookingStatus(bookingId, newStatus);
    setUpdatingId(null);
    if (result.success) {
      setActionMsg(`Booking #FM-${bookingId} status updated to ${newStatus}!`);
      fetchBookings();
    } else {
      setErrorMsg(result.error || 'Failed to update booking status');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <span className="badge bg-primary text-white fw-bold mb-1">Provider Operations</span>
          <h2 className="fw-extrabold text-dark mb-0">Booking Job Management</h2>
          <p className="text-muted small">Accept customer requests, update job progression, and mark jobs as completed.</p>
        </div>
        <button className="btn btn-outline-secondary rounded-pill px-4 fw-bold d-flex align-items-center gap-1" onClick={() => setCurrentPage('provider-dashboard')}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
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

      {loading ? (
        <div className="text-center py-5 text-muted card card-fixmate p-5">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div> Loading your job orders...
        </div>
      ) : bookingList.length === 0 ? (
        <div className="text-center py-5 text-muted card card-fixmate p-5">
          <h5 className="fw-bold text-dark mb-1">No Booking Requests</h5>
          <p className="small text-muted mb-0">You currently have no customer bookings assigned.</p>
        </div>
      ) : (
        <div className="row g-4">
          {bookingList.map((b) => {
            const rawId = b.bookingId;
            const status = (b.status || '').toUpperCase();

            return (
              <div className="col-lg-6" key={rawId}>
                <div className={`card card-fixmate p-4 h-100 border-start border-4 ${b.emergencyFlag ? 'border-danger' : 'border-primary'}`}>
                  <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-extrabold text-dark">FM-{rawId}</span>
                      {b.emergencyFlag && (
                        <span className="badge bg-danger text-white rounded-pill px-2 py-1 small d-flex align-items-center gap-1">
                          <Zap size={12} fill="currentColor" /> Priority Emergency
                        </span>
                      )}
                    </div>
                    <span className="badge bg-light text-primary border rounded-pill px-3 py-1 fw-bold">
                      {status}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-1">{b.service?.serviceName || 'Home Service'}</h5>
                  <p className="text-muted small mb-1">Customer Name: <strong>{b.customer?.name || 'Resident Customer'}</strong> ({b.customer?.phone || ''})</p>
                  <p className="text-muted small mb-1">Address: <strong>{b.address}</strong></p>
                  <p className="text-muted small mb-3">Scheduled: <strong>{b.bookingDate ? b.bookingDate.split('T')[0] : 'Today'}</strong></p>

                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                    <span className="fw-extrabold fs-5 text-dark">₹{b.service?.price || 499}</span>

                    <div className="d-flex gap-2">
                      {status === 'REQUESTED' && (
                        <>
                          <button 
                            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" 
                            onClick={() => updateStatus(rawId, 'REJECTED')}
                            disabled={updatingId === rawId}
                          >
                            Reject
                          </button>
                          <button 
                            className="btn btn-success btn-sm rounded-pill px-3 fw-bold" 
                            onClick={() => updateStatus(rawId, 'ACCEPTED')}
                            disabled={updatingId === rawId}
                          >
                            {updatingId === rawId ? 'Saving...' : 'Accept Job'}
                          </button>
                        </>
                      )}

                      {status === 'ACCEPTED' && (
                        <button 
                          className="btn btn-primary text-white btn-sm rounded-pill px-3 fw-bold" 
                          onClick={() => updateStatus(rawId, 'IN_PROGRESS')}
                          disabled={updatingId === rawId}
                        >
                          {updatingId === rawId ? 'Saving...' : 'Start Job (In Progress) 🛠️'}
                        </button>
                      )}

                      {status === 'IN_PROGRESS' && (
                        <button 
                          className="btn btn-success btn-sm rounded-pill px-3 fw-bold" 
                          onClick={() => updateStatus(rawId, 'COMPLETED')}
                          disabled={updatingId === rawId}
                        >
                          {updatingId === rawId ? 'Saving...' : 'Mark Completed ✓'}
                        </button>
                      )}

                      {status === 'COMPLETED' && (
                        <span className="badge bg-success bg-opacity-25 text-success fw-bold px-3 py-2 rounded-pill">
                          ✓ Job Completed
                        </span>
                      )}

                      {status === 'REJECTED' && (
                        <span className="badge bg-danger bg-opacity-25 text-danger fw-bold px-3 py-2 rounded-pill">
                          ✕ Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
