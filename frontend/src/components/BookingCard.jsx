import React from 'react';
import { Calendar, Clock, MapPin, PhoneCall, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BookingCard({ booking, onTrack, onUpdateStatus }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Requested':
        return <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 rounded-pill px-3 py-1">⌛ Requested</span>;
      case 'Accepted':
        return <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 rounded-pill px-3 py-1">👍 Accepted</span>;
      case 'In Progress':
        return <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-50 rounded-pill px-3 py-1">🛠️ In Progress</span>;
      case 'Completed':
        return <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 rounded-pill px-3 py-1">✅ Completed</span>;
      default:
        return <span className="badge bg-secondary rounded-pill px-3 py-1">{status}</span>;
    }
  };

  return (
    <div className="card card-fixmate p-3 mb-3">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2 pb-2 border-bottom">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-bold text-dark">{booking.id}</span>
          {booking.emergency && (
            <span className="badge bg-danger text-white rounded-pill px-2 py-1 small d-flex align-items-center gap-1">
              <Zap size={12} fill="currentColor" /> Priority Emergency
            </span>
          )}
        </div>
        <div>{getStatusBadge(booking.status)}</div>
      </div>

      <h6 className="fw-bold text-dark mb-1">{booking.serviceName}</h6>
      <p className="text-muted small mb-2">
        <strong>Provider:</strong> {booking.providerName} ({booking.providerPhone})
      </p>

      <div className="row g-2 text-muted small mb-3">
        <div className="col-sm-6 d-flex align-items-center gap-1">
          <Calendar size={14} className="text-secondary" /> {booking.date} at {booking.time}
        </div>
        <div className="col-sm-6 d-flex align-items-center gap-1">
          <MapPin size={14} className="text-secondary" /> {booking.address}
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between pt-2 border-top">
        <span className="fw-extrabold fs-6 text-dark">₹{booking.amount}</span>

        <div className="d-flex gap-2">
          {onTrack && (
            <button 
              className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold"
              onClick={() => onTrack(booking)}
            >
              Track Live Status
            </button>
          )}

          {onUpdateStatus && booking.status !== 'Completed' && (
            <button 
              className="btn btn-success btn-sm rounded-pill px-3 fw-semibold"
              onClick={() => onUpdateStatus(booking.id, booking.status === 'Requested' ? 'Accepted' : booking.status === 'Accepted' ? 'In Progress' : 'Completed')}
            >
              Advance Status →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
