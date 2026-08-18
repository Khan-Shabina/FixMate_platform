import React, { useState, useEffect } from 'react';
import { Zap, AlertTriangle, Clock, MapPin, PhoneCall, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function EmergencyModal({ isOpen, onClose, onBookingSuccess, user }) {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState('');
  const [address, setAddress] = useState('Flat 402, Green Valley Society, Andheri East, Mumbai');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [notes, setNotes] = useState('Emergency fix required immediately.');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      apiService.getServices().then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
          // Default to Plumbing or Electrical if available
          const preferred = data.find(s => (s.category || '').toLowerCase().includes('plumb') || (s.category || '').toLowerCase().includes('elect')) || data[0];
          setServiceId(preferred.serviceId || preferred.id);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    const customerId = user?.userId || user?.id || 1;
    const now = new Date();
    const isoDateTime = now.toISOString().replace('Z', '');

    const payload = {
      customerId: Number(customerId),
      serviceId: Number(serviceId),
      providerId: null, // Auto-dispatch by backend
      bookingDate: isoDateTime,
      address: address.trim(),
      emergencyFlag: true,
      notes: notes.trim() || '24/7 Priority Emergency Dispatch'
    };

    const result = await apiService.createBooking(payload);
    setSubmitting(false);

    if (result.success && result.data) {
      const b = result.data;
      const formattedBooking = {
        id: `EMG-${b.bookingId}`,
        rawBookingId: b.bookingId,
        serviceName: b.service?.serviceName || 'Emergency Service',
        category: b.service?.category || 'Emergency',
        providerName: b.provider?.name || (b.provider?.user ? b.provider.user.name : 'Emergency Responder'),
        providerPhone: b.provider?.phone || (b.provider?.user ? b.provider.user.phone : ''),
        date: 'Today (Immediate)',
        time: 'Within 15 Mins',
        status: b.status || 'REQUESTED',
        emergency: true,
        amount: b.service?.price ? Number(b.service.price) + 100 : 599,
        address: b.address || address
      };
      onBookingSuccess(formattedBooking);
      onClose();
    } else {
      setErrorMsg(result.error || 'Emergency auto-dispatch failed. No verified providers currently available.');
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          {/* Header */}
          <div className="modal-header bg-danger text-white border-0 py-3">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-white bg-opacity-25 rounded-circle p-2 d-flex align-items-center justify-content-center">
                <Zap size={22} fill="currentColor" />
              </div>
              <div>
                <h5 className="modal-title fw-bold mb-0">24/7 Priority Emergency Service</h5>
                <small className="text-white opacity-90" style={{ fontSize: '0.78rem' }}>Backend Auto-Dispatch to Top Verified Available Worker</small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} disabled={submitting}></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {errorMsg && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 small">
                <AlertCircle size={18} className="shrink-0" />
                <div>{errorMsg}</div>
              </div>
            )}

            {submitting ? (
              <div className="text-center py-4">
                <div className="spinner-border text-danger mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                <h5 className="fw-bold text-dark mb-2">Auto-Dispatching Nearest Verified Technician...</h5>
                <p className="text-muted small">Locating highest trust score verified emergency responder nearby...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="alert alert-warning border-warning border-opacity-25 d-flex align-items-center gap-2 py-2 mb-3">
                  <AlertTriangle size={20} className="text-warning shrink-0" />
                  <span className="small text-dark fw-medium">Emergency requests carry top priority for available technicians near your location.</span>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-secondary">Select Emergency Issue</label>
                  <select className="form-select rounded-3 py-2 fw-medium" value={serviceId} onChange={(e) => setServiceId(e.target.value)} required>
                    {services.map((s) => (
                      <option key={s.serviceId || s.id} value={s.serviceId || s.id}>
                        ⚡ {s.serviceName} ({s.category})
                      </option>
                    ))}
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
                  <textarea className="form-control" rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Describe the urgent breakdown..."></textarea>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                  <div className="small text-muted">
                    <Clock size={14} className="me-1 d-inline" /> Estimated Arrival: <b>10-15 mins</b>
                  </div>
                  <button type="submit" className="btn btn-danger px-4 py-2 fw-bold">
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
