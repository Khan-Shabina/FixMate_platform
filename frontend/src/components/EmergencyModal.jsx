import React, { useState } from 'react';
import { Zap, AlertTriangle, Clock, MapPin, PhoneCall } from 'lucide-react';

export default function EmergencyModal({ isOpen, onClose, onBookingSuccess }) {
  const [service, setService] = useState('Emergency Plumbing');
  const [address, setAddress] = useState('Flat 402, Green Valley Society, Andheri East');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [notes, setNotes] = useState('Pipe burst in kitchen area! Need immediate assistance.');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onBookingSuccess({
        id: `EMG-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceName: service,
        category: 'Emergency',
        providerName: 'Rahul Sharma (Emergency Responder)',
        providerPhone: '+91 98200 11223',
        date: 'Today (Immediate)',
        time: 'Within 15 Mins',
        status: 'In Progress',
        emergency: true,
        amount: 599,
        address
      });
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-fixmate-orange text-white border-0 py-3">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-white bg-opacity-25 rounded-circle p-2 d-flex align-items-center justify-content-center">
                <Zap size={22} fill="currentColor" />
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">24/7 Priority Emergency Service</h5>
                <small className="text-white opacity-90" style={{ fontSize: '0.78rem' }}>Verified Technicians Dispatched in under 15 minutes</small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {submitted ? (
              <div className="text-center py-4">
                <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                <h5 className="fw-bold text-dark mb-2">Locating Nearest Available Emergency Worker...</h5>
                <p className="text-muted small">Dispatching priority alert to Rahul Sharma (Trust Score: 97%)...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="alert alert-warning border-warning border-opacity-25 d-flex align-items-center gap-2 py-2 mb-3">
                  <AlertTriangle size={20} className="text-warning shrink-0" />
                  <span className="small text-dark fw-medium">Emergency requests carry top priority for available technicians near your location.</span>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Select Emergency Issue</label>
                  <select className="form-select rounded-3 py-2 fw-medium" value={service} onChange={(e) => setService(e.target.value)}>
                    <option value="Emergency Plumbing">🚿 Emergency Plumbing & Main Leakage</option>
                    <option value="Electricity Failure">⚡ Total Electricity Failure / Short Circuit</option>
                    <option value="AC Gas Leak">❄️ AC Breakdown / Sudden Water Leakage</option>
                    <option value="Door Lock Jam">🔑 Main Door Lock Jam / Key Failure</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Service Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><MapPin size={16} className="text-muted" /></span>
                    <input type="text" className="form-control border-start-0 py-2" value={address} onChange={(e) => setAddress(e.target.value)} required />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Contact Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0"><PhoneCall size={16} className="text-muted" /></span>
                    <input type="text" className="form-control border-start-0 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold small text-secondary">Problem Details (Optional)</label>
                  <textarea className="form-control" rows="2" value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                  <div className="small text-muted">
                    <Clock size={14} className="me-1 d-inline" /> Estimated Arrival: <b>10-15 mins</b>
                  </div>
                  <button type="submit" className="btn btn-emergency px-4 py-2">
                    <Zap size={16} fill="currentColor" className="me-1" /> Dispatch Emergency Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
