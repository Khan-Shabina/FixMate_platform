import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Zap, ArrowRight, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function Booking({ selectedService, selectedProvider, setCurrentPage, setTrackedBooking, user }) {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceId, setServiceId] = useState(selectedService?.id || selectedService?.serviceId || '');
  const [providerId, setProviderId] = useState(selectedProvider?.id || selectedProvider?.providerId || '');
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('10:00:00');
  const [address, setAddress] = useState('Flat 402, Green Valley Society, Andheri East, Mumbai');
  const [emergency, setEmergency] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadCatalog = async () => {
      const [sList, pList] = await Promise.all([
        apiService.getServices(),
        apiService.getProviders()
      ]);
      if (Array.isArray(sList) && sList.length > 0) {
        setServices(sList);
        if (!serviceId) {
          setServiceId(sList[0].serviceId || sList[0].id);
        }
      }
      if (Array.isArray(pList)) {
        setProviders(pList);
      }
    };
    loadCatalog();
  }, []);

  const currentService = services.find(s => String(s.serviceId || s.id) === String(serviceId)) || selectedService;
  const currentProvider = providers.find(p => String(p.providerId || p.id) === String(providerId)) || selectedProvider;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const customerId = user?.userId || user?.id || 1;
    const combinedDateTime = `${date}T${time.length === 5 ? time + ':00' : time}`;

    const payload = {
      customerId: Number(customerId),
      serviceId: Number(serviceId || currentService?.serviceId || currentService?.id),
      providerId: providerId && !emergency ? Number(providerId) : null,
      bookingDate: combinedDateTime,
      address: address.trim(),
      emergencyFlag: Boolean(emergency),
      notes: emergency ? 'Priority Emergency Request' : 'Standard Booking'
    };

    const result = await apiService.createBooking(payload);
    setLoading(false);

    if (result.success && result.data) {
      const b = result.data;
      setTrackedBooking({
        id: `FM-${b.bookingId}`,
        rawBookingId: b.bookingId,
        serviceName: b.service?.serviceName || currentService?.serviceName || 'Home Service',
        category: b.service?.category || currentService?.category || 'General',
        providerName: b.provider?.name || (b.provider?.user ? b.provider.user.name : 'Assigned Technician'),
        providerPhone: b.provider?.phone || (b.provider?.user ? b.provider.user.phone : ''),
        date: b.bookingDate ? b.bookingDate.split('T')[0] : date,
        time: b.bookingDate && b.bookingDate.includes('T') ? b.bookingDate.split('T')[1].substring(0, 5) : '10:00',
        status: b.status || 'REQUESTED',
        emergency: b.emergencyFlag || false,
        amount: b.service?.price || currentService?.price || 499,
        address: b.address || address
      });
      setCurrentPage('tracking');
    } else {
      setErrorMsg(result.error || 'Failed to create booking. Please check provider availability.');
    }
  };

  const basePrice = currentService?.price ? Number(currentService.price) : 499;
  const totalPrice = basePrice + (emergency ? 100 : 0);

  return (
    <div className="container py-5">
      <div className="row g-4 justify-content-center">
        <div className="col-lg-8">
          <div className="card card-fixmate border-0 shadow-lg p-4 p-md-5">
            <h3 className="fw-extrabold text-dark mb-4">Book Service Appointment</h3>

            {errorMsg && (
              <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                <AlertCircle size={18} /> {errorMsg}
              </div>
            )}

            {/* Service & Worker Summary Box */}
            <div className="bg-light p-3 rounded-3 border mb-4 d-flex align-items-center justify-content-between">
              <div>
                <span className="badge bg-primary mb-1">{currentService?.category || 'Service Category'}</span>
                <h5 className="fw-bold text-dark mb-0">{currentService?.serviceName || 'Selected Service'}</h5>
                <small className="text-muted">
                  {emergency ? (
                    <strong className="text-danger">⚡ Emergency Mode: Auto-dispatching highest trust verified technician</strong>
                  ) : currentProvider ? (
                    <>Assigned Worker: <strong>{currentProvider.name || currentProvider.user?.name}</strong> (Trust Score: {currentProvider.trustScore}%)</>
                  ) : (
                    <>Assigned Worker: <strong>Auto-assigned top verified provider</strong></>
                  )}
                </small>
              </div>
              <div className="text-end">
                <span className="text-muted small d-block">Base Price</span>
                <span className="fw-extrabold fs-4 text-dark">₹{basePrice}</span>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit}>
              {/* Select Service if not pre-selected */}
              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Choose Service</label>
                <select 
                  className="form-select py-2" 
                  value={serviceId} 
                  onChange={(e) => setServiceId(e.target.value)}
                  required
                >
                  {services.map((s) => (
                    <option key={s.serviceId || s.id} value={s.serviceId || s.id}>
                      {s.serviceName} ({s.category}) — ₹{s.price}
                    </option>
                  ))}
                </select>
              </div>

              {!emergency && providers.length > 0 && (
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Preferred Provider (Optional)</label>
                  <select 
                    className="form-select py-2" 
                    value={providerId} 
                    onChange={(e) => setProviderId(e.target.value)}
                  >
                    <option value="">Auto-assign best available provider</option>
                    {providers.map((p) => (
                      <option key={p.providerId || p.id} value={p.providerId || p.id}>
                        {p.name || p.user?.name} ({p.experience} Exp, {p.location}) — Trust Score: {p.trustScore}%
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Service Date</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><Calendar size={18} className="text-muted" /></span>
                    <input type="date" className="form-control border-start-0 py-2" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary">Preferred Time Slot</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><Clock size={18} className="text-muted" /></span>
                    <select className="form-select border-start-0 py-2" value={time} onChange={(e) => setTime(e.target.value)}>
                      <option value="09:00:00">09:00 AM - 11:00 AM</option>
                      <option value="10:00:00">10:00 AM - 12:00 PM</option>
                      <option value="14:00:00">02:00 PM - 04:00 PM</option>
                      <option value="17:00:00">05:00 PM - 07:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Service Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><MapPin size={18} className="text-muted" /></span>
                  <input type="text" className="form-control border-start-0 py-2" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
              </div>

              {/* Emergency Option Checkbox */}
              <div className="form-check form-switch p-3 bg-warning bg-opacity-10 rounded-3 border border-warning border-opacity-50 mb-4">
                <input 
                  className="form-check-input ms-0 me-2" 
                  type="checkbox" 
                  id="emergencyCheck"
                  checked={emergency}
                  onChange={(e) => setEmergency(e.target.checked)}
                />
                <label className="form-check-label fw-bold text-dark" htmlFor="emergencyCheck">
                  <Zap size={16} fill="currentColor" className="text-warning me-1 d-inline" /> Mark as Emergency Request (+₹100 for immediate response within 15 mins)
                </label>
              </div>

              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                <div>
                  <span className="text-muted small d-block">Total Estimated Cost</span>
                  <span className="fw-extrabold fs-3 text-dark">₹{totalPrice}</span>
                </div>
                <button type="submit" className="btn btn-fixmate-primary btn-lg rounded-pill px-5 fw-bold" disabled={loading}>
                  {loading ? (
                    <span><span className="spinner-border spinner-border-sm me-2"></span> Booking...</span>
                  ) : (
                    <span>Confirm Booking <ArrowRight size={18} className="ms-1 d-inline" /></span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
