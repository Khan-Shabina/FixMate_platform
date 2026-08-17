import React from 'react';
import { CheckCircle, Clock, MapPin, PhoneCall, ShieldCheck, UserCheck, Zap, AlertCircle } from 'lucide-react';

export default function BookingTracking({ trackedBooking, setCurrentPage }) {
  if (!trackedBooking) {
    return (
      <div className="container py-5 text-center">
        <div className="card card-fixmate p-5 max-w-lg mx-auto">
          <Clock size={48} className="text-muted mx-auto mb-3" />
          <h4 className="fw-bold text-dark">No Active Booking Selected for Tracking</h4>
          <p className="text-muted small mb-4">You can track your service bookings in real-time from your Customer Dashboard.</p>
          <button className="btn btn-fixmate-primary rounded-pill px-4 fw-bold mx-auto" onClick={() => setCurrentPage('customer-dashboard')}>
            Go to Customer Dashboard
          </button>
        </div>
      </div>
    );
  }

  const b = trackedBooking;

  const steps = [
    { title: 'Requested', desc: 'Booking sent to local provider', key: 'REQUESTED' },
    { title: 'Accepted', desc: 'Worker confirmed appointment', key: 'ACCEPTED' },
    { title: 'In Progress', desc: 'Worker arrived at location', key: 'IN_PROGRESS' },
    { title: 'Completed', desc: 'Service finished & verified', key: 'COMPLETED' }
  ];

  const getCurrentStepIndex = () => {
    const status = (b.status || '').toUpperCase();
    switch (status) {
      case 'REQUESTED': return 0;
      case 'ACCEPTED': return 1;
      case 'IN_PROGRESS': return 2;
      case 'COMPLETED': return 3;
      default: return 0;
    }
  };

  const activeIdx = getCurrentStepIndex();

  return (
    <div className="container py-5">
      <div className="card card-fixmate border-0 shadow-lg p-4 p-md-5 max-w-3xl mx-auto">
        <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-3 mb-4 gap-2">
          <div>
            <span className="badge bg-primary bg-opacity-10 text-primary fw-bold mb-1">Live Tracking</span>
            <h4 className="fw-extrabold text-dark mb-0">Booking #{b.id || 'FM-1001'}</h4>
          </div>
          <div className="text-end">
            <span className="text-muted small d-block">Current Status</span>
            <span className="fw-bold fs-6 text-primary">{b.status}</span>
          </div>
        </div>

        {/* Visual Stepper */}
        <div className="d-flex justify-content-between mb-5 px-2">
          {steps.map((step, idx) => {
            const isCompleted = idx <= activeIdx;
            const isActive = idx === activeIdx;
            return (
              <div key={step.key} className={`stepper-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                <div className="stepper-circle">
                  {isCompleted ? <CheckCircle size={22} /> : idx + 1}
                </div>
                <div className="fw-bold small text-dark mb-0">{step.title}</div>
                <small className="text-muted d-none d-sm-block" style={{ fontSize: '0.68rem' }}>{step.desc}</small>
              </div>
            );
          })}
        </div>

        {/* Worker Details & Live Status Box */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="bg-light p-3 rounded-3 border h-100">
              <h6 className="fw-bold text-dark mb-2">Assigned Service Professional</h6>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle bg-primary bg-opacity-10 text-primary p-3 fw-bold">
                  <UserCheck size={28} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">{b.providerName || 'Assigned Technician'}</h6>
                  <small className="text-muted d-block">{b.serviceName || 'Service'}</small>
                  <span className="text-success small fw-bold"><ShieldCheck size={14} className="d-inline me-1" /> Verified Service Professional</span>
                </div>
              </div>
              {b.providerPhone && b.providerPhone !== 'N/A' && (
                <div className="mt-3 pt-2 border-top d-flex gap-2">
                  <a href={`tel:${b.providerPhone}`} className="btn btn-outline-primary btn-sm rounded-pill flex-fill fw-bold">
                    <PhoneCall size={14} className="me-1" /> Call Worker
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="bg-light p-3 rounded-3 border h-100">
              <h6 className="fw-bold text-dark mb-2">Appointment Details</h6>
              <ul className="list-unstyled small text-muted mb-0 d-grid gap-1">
                <li><strong>Date & Time:</strong> {b.date} at {b.time}</li>
                <li><strong>Address:</strong> {b.address}</li>
                <li><strong>Priority:</strong> {b.emergency ? '⚡ Priority Emergency' : 'Standard'}</li>
                <li><strong>Total Amount:</strong> ₹{b.amount}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center pt-3 border-top">
          <button className="btn btn-outline-secondary rounded-pill px-4 me-2 fw-semibold" onClick={() => setCurrentPage('customer-dashboard')}>
            Back to Dashboard
          </button>
          <button className="btn btn-fixmate-primary rounded-pill px-4 fw-semibold" onClick={() => setCurrentPage('services')}>
            Book Another Service
          </button>
        </div>
      </div>
    </div>
  );
}
