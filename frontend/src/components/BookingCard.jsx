import React, { useState } from 'react';
import { Calendar, MapPin, Zap, Star, MessageSquareCheck } from 'lucide-react';
import { apiService } from '../services/api';

export default function BookingCard({ booking, onTrack, onUpdateStatus, onReviewSuccess }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  const [reviewed, setReviewed] = useState(false);

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'REQUESTED':
        return <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50 rounded-pill px-3 py-1">⌛ Requested</span>;
      case 'ACCEPTED':
        return <span className="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-50 rounded-pill px-3 py-1">👍 Accepted</span>;
      case 'IN_PROGRESS':
      case 'IN PROGRESS':
        return <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-50 rounded-pill px-3 py-1">🛠️ In Progress</span>;
      case 'COMPLETED':
        return <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 rounded-pill px-3 py-1">✅ Completed</span>;
      case 'CANCELLED':
        return <span className="badge bg-secondary rounded-pill px-3 py-1">❌ Cancelled</span>;
      case 'REJECTED':
        return <span className="badge bg-danger rounded-pill px-3 py-1">🚫 Rejected</span>;
      default:
        return <span className="badge bg-secondary rounded-pill px-3 py-1">{status}</span>;
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewMsg('');
    const rawId = booking.rawBookingId || (typeof booking.id === 'string' ? booking.id.replace('FM-', '').replace('EMG-', '') : booking.id);
    const result = await apiService.submitReview({
      bookingId: Number(rawId),
      rating: Number(rating),
      comment
    });
    setReviewLoading(false);
    if (result.success) {
      setReviewed(true);
      setReviewMsg('Thank you! Your verified review and rating have been recorded.');
      setTimeout(() => {
        setShowReviewModal(false);
        if (onReviewSuccess) onReviewSuccess();
      }, 1500);
    } else {
      setReviewMsg(result.error || 'Failed to submit review');
    }
  };

  const isCompleted = (booking.status || '').toUpperCase() === 'COMPLETED';

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
        <strong>Provider:</strong> {booking.providerName} {booking.providerPhone ? `(${booking.providerPhone})` : ''}
      </p>

      <div className="row g-2 text-muted small mb-3">
        <div className="col-sm-6 d-flex align-items-center gap-1">
          <Calendar size={14} className="text-secondary" /> {booking.date} {booking.time ? `at ${booking.time}` : ''}
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

          {isCompleted && (
            <button 
              className="btn btn-outline-warning text-dark btn-sm rounded-pill px-3 fw-semibold d-flex align-items-center gap-1"
              onClick={() => setShowReviewModal(true)}
            >
              <Star size={14} fill="#f59e0b" className="text-warning" /> Leave Review
            </button>
          )}

          {onUpdateStatus && !isCompleted && (
            <button 
              className="btn btn-success btn-sm rounded-pill px-3 fw-semibold"
              onClick={() => {
                const s = (booking.status || '').toUpperCase();
                const nextStatus = s === 'REQUESTED' ? 'ACCEPTED' : s === 'ACCEPTED' ? 'IN_PROGRESS' : 'COMPLETED';
                onUpdateStatus(booking.id, nextStatus);
              }}
            >
              Advance Status →
            </button>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 p-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <MessageSquareCheck className="text-warning" /> Rate & Review Provider
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowReviewModal(false)}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-3">
                  Your feedback helps maintain FixMate's transparent Community Trust Score for <strong>{booking.providerName}</strong>.
                </p>

                {reviewMsg && (
                  <div className={`alert ${reviewed ? 'alert-success' : 'alert-danger'} small py-2`}>
                    {reviewMsg}
                  </div>
                )}

                {!reviewed && (
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary">Rating (1 to 5 Stars)</label>
                      <div className="d-flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="btn btn-link p-1 text-decoration-none"
                            onClick={() => setRating(star)}
                          >
                            <Star
                              size={28}
                              fill={star <= rating ? '#f59e0b' : 'none'}
                              className={star <= rating ? 'text-warning' : 'text-muted'}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary">Feedback & Comments (Optional)</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Tell us about the punctuality, quality of work, and professionalism..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                      <button type="button" className="btn btn-light rounded-pill px-3" onClick={() => setShowReviewModal(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-warning rounded-pill px-4 fw-bold" disabled={reviewLoading}>
                        {reviewLoading ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
