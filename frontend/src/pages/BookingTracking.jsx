import React from 'react';
import { CheckCircle, PhoneCall, ShieldCheck, UserCheck } from 'lucide-react';
import { mockBookings } from '../data/mockData';

export default function BookingTracking({ trackedBooking, setCurrentPage }) {
  const b = trackedBooking || mockBookings[0];

  const steps = [
    { title: 'Requested', desc: 'Booking sent to local provider', key: 'Requested' },
    { title: 'Accepted', desc: 'Worker confirmed appointment', key: 'Accepted' },
    { title: 'In Progress', desc: 'Worker arrived at location', key: 'In Progress' },
    { title: 'Completed', desc: 'Service finished & verified', key: 'Completed' }
  ];

  const getCurrentStepIndex = () => {
    switch (b.status) {
      case 'Requested': return 0;
      case 'Accepted': return 1;
      case 'In Progress': return 2;
      case 'Completed': return 3;
      default: return 1;
    }
  };

  const activeIdx = getCurrentStepIndex();

  return (
    <div className="container py-5">
      <div className="card card-fixmate border-0 shadow-lg p-4 p-md-5 max-w-3xl mx-auto">
        <div className="d-flex flex-wrap align-items-center justify-content-between border-bottom pb-3 mb-4 gap-2">
          <div>
            <span className="badge bg-primary bg-opacity-10 text-primary fw-bold mb-1">Live Tracking</span>
            <h4 className="fw-extrabold text-dark mb-0">Booking #{b.id}</h4>
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
                  <h6 className="fw-bold text-dark mb-0">{b.providerName}</h6>
                  <small className="text-muted d-block">{b.serviceName}</small>
                  <span className="text-success small fw-bold"><ShieldCheck size={14} className="d-inline me-1" /> 97% Verified Trust</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-top d-flex gap-2">
                <a href={`tel:${b.providerPhone}`} className="btn btn-outline-primary btn-sm rounded-pill flex-fill fw-bold">
                  <PhoneCall size={14} className="me-1" /> Call Worker
                </a>
              </div>
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
