import React, { useState } from 'react';
import { mockBookings } from '../data/mockData';

export default function ProviderBookingMgmt({ setCurrentPage }) {
  const [bookingList, setBookingList] = useState(mockBookings);

  const updateStatus = (id, newStatus) => {
    setBookingList(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
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
                  {b.status === 'Requested' && (
                    <>
                      <button className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-bold" onClick={() => updateStatus(b.id, 'Cancelled')}>
                        Reject
                      </button>
                      <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold" onClick={() => updateStatus(b.id, 'Accepted')}>
                        Accept Job
                      </button>
                    </>
                  )}

                  {b.status === 'Accepted' && (
                    <button className="btn btn-info text-white btn-sm rounded-pill px-3 fw-bold" onClick={() => updateStatus(b.id, 'In Progress')}>
                      Start Service (In Progress)
                    </button>
                  )}

                  {b.status === 'In Progress' && (
                    <button className="btn btn-success btn-sm rounded-pill px-3 fw-bold" onClick={() => updateStatus(b.id, 'Completed')}>
                      Mark Completed ✓
                    </button>
                  )}

                  {b.status === 'Completed' && (
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
    </div>
  );
}
