import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Zap, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';

export default function ProviderBookingMgmt({ setCurrentPage, user }) {
  const [bookingList, setBookingList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    const providerId = user?.providerId || user?.userId || user?.id;
    const data = await apiService.getProviderBookings(providerId);
    if (Array.isArray(data)) {
      setBookingList(data.map(b => ({
        id: b.bookingId ? `FM-${b.bookingId}` : (b.id || 'FM-1001'),
        rawId: b.bookingId || b.id,
        serviceName: b.service?.serviceName || b.serviceName || 'Home Service',
        address: b.address || 'Address',
        date: b.bookingDate ? b.bookingDate.split('T')[0] : 'Scheduled',
        time: b.bookingDate && b.bookingDate.includes('T') ? b.bookingDate.split('T')[1].substring(0, 5) : '10:00 AM',
        emergency: b.emergencyFlag || false,
        status: b.status || 'REQUESTED',
        amount: b.service?.price || b.amount || 0
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const updateStatus = async (rawId, newStatus) => {
    const res = await apiService.updateBookingStatus(rawId, newStatus);
    if (res.success) {
      setBookingList(prev => prev.map(b => b.rawId === rawId ? { ...b, status: newStatus } : b));
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <span className="badge bg-primary text-white fw-bold mb-1">Provider Requests</span>
          <h2 className="fw-extrabold text-dark mb-0">Booking Management</h2>
          <p className="text-muted small">Accept incoming customer requests, update job progression, or mark jobs completed.</p>
        </div>
        <button className="btn btn-outline-secondary rounded-pill px-4 fw-bold" onClick={() => setCurrentPage('provider-dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div> Loading bookings...
        </div>
      ) : bookingList.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <Clock size={40} className="text-muted mb-2" />
          <h5 className="fw-bold text-dark">No Job Requests Assigned</h5>
          <p className="text-muted small">New customer booking requests will show up here in real time.</p>
        </div>
      ) : (
        <div className="row g-4">
          {bookingList.map((b) => (
            <div className="col-lg-6" key={b.id}>
              <div className="card card-fixmate p-4 h-100 border-start border-4 border-primary">
                <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-extrabold text-dark">{b.id}</span>
                    {b.emergency && (
                      <span className="badge bg-danger text-white rounded-pill px-2 py-1 small">
                        ⚡ Emergency Priority
                      </span>
                    )}
                  </div>
                  <span className="badge bg-light text-primary border rounded-pill px-3 py-1 fw-bold">
                    {b.status}
                  </span>
                </div>

                <h5 className="fw-bold text-dark mb-1">{b.serviceName}</h5>
                <p className="text-muted small mb-2">Customer Address: <strong>{b.address}</strong></p>
                <p className="text-muted small mb-3">Scheduled: <strong>{b.date} at {b.time}</strong></p>

                <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                  <span className="fw-extrabold fs-5 text-dark">₹{b.amount}</span>

                  <div className="d-flex gap-2">
                    {b.status === 'REQUESTED' && (
                      <>
                        <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" onClick={() => updateStatus(b.rawId, 'CANCELLED')}>
                          Reject
                        </button>
                        <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold" onClick={() => updateStatus(b.rawId, 'ACCEPTED')}>
                          Accept Job
                        </button>
                      </>
                    )}

                    {b.status === 'ACCEPTED' && (
                      <button className="btn btn-info text-white btn-sm rounded-pill px-3 fw-bold" onClick={() => updateStatus(b.rawId, 'IN_PROGRESS')}>
                        Start Service (In Progress)
                      </button>
                    )}

                    {b.status === 'IN_PROGRESS' && (
                      <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold" onClick={() => updateStatus(b.rawId, 'COMPLETED')}>
                        Mark Completed ✓
                      </button>
                    )}

                    {b.status === 'COMPLETED' && (
                      <span className="badge bg-success bg-opacity-25 text-success fw-bold px-3 py-2 rounded-pill">
                        ✓ Job Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
