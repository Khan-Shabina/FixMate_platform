import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';

export default function Booking({ selectedService, selectedProvider, setCurrentPage, setTrackedBooking, user }) {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [serviceId, setServiceId] = useState(selectedService?.id || selectedService?.serviceId || '');
  const [providerId, setProviderId] = useState(selectedProvider?.providerId || selectedProvider?.id || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [address, setAddress] = useState('');
  const [emergency, setEmergency] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadDropdowns = async () => {
      const [srvList, provList] = await Promise.all([
        apiService.getServices(),
        apiService.getProviders()
      ]);
      if (Array.isArray(srvList) && srvList.length > 0) {
        setServices(srvList);
        if (!serviceId) setServiceId(srvList[0].serviceId || srvList[0].id);
      }
      if (Array.isArray(provList) && provList.length > 0) {
        setProviders(provList);
        if (!providerId) setProviderId(provList[0].providerId || provList[0].id);
      }
    };
    loadDropdowns();

    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const currentService = services.find(s => (s.serviceId || s.id) == serviceId) || selectedService;
  const currentProvider = providers.find(p => (p.providerId || p.id) == providerId) || selectedProvider;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!serviceId) {
      setErrorMsg('Please select a service');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    const bookingPayload = {
      customerId: user?.userId || user?.id || 1,
      serviceId: Number(serviceId),
      providerId: providerId ? Number(providerId) : null,
      bookingDate: `${date}T${time.includes('PM') ? '14:00:00' : '10:00:00'}`,
      address: address.trim() || 'Customer Address',
      emergencyFlag: emergency
    };

    const res = await apiService.createBooking(bookingPayload);
    setLoading(false);

    if (res.success && res.data) {
      setTrackedBooking({
        id: res.data.bookingId ? `FM-${res.data.bookingId}` : 'FM-1001',
        serviceName: currentService?.serviceName || currentService?.name || 'Home Service',
        providerName: currentProvider?.name || 'Assigned Technician',
        providerPhone: currentProvider?.phone || '+91 98200 00000',
        date,
        time,
        address,
        emergency,
        amount: (currentService?.price ? Number(currentService.price) : 499) + (emergency ? 100 : 0),
        status: res.data.status || 'REQUESTED'
      });
      setCurrentPage('tracking');
    } else {
      setErrorMsg(res.error || 'Failed to create booking. Please make sure the service is available.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4 justify-content-center">
        <div className="col-lg-8">
          <div className="card card-fixmate border-0 shadow-lg p-4 p-md-5">
            <h3 className="fw-extrabold text-dark mb-4">Book Service Appointment</h3>

            {errorMsg && (
              <div className="alert alert-danger py-2 small mb-3">
                {errorMsg}
              </div>
            )}

            {/* Service Selection Box */}
            <div className="bg-light p-3 rounded-3 border mb-4">
              <div className="row g-3 align-items-center">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary mb-1">Select Service</label>
                  <select 
                    className="form-select" 
                    value={serviceId} 
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                  >
                    {services.length === 0 ? (
                      <option value="">No services available</option>
                    ) : (
                      services.map(s => (
                        <option key={s.serviceId || s.id} value={s.serviceId || s.id}>
                          {s.serviceName || s.name} (₹{s.price})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-secondary mb-1">Preferred Technician (Optional)</label>
                  <select 
                    className="form-select" 
                    value={providerId} 
                    onChange={(e) => setProviderId(e.target.value)}
                  >
                    <option value="">Auto-Assign Best Available Technician</option>
                    {providers.map(p => (
                      <option key={p.providerId || p.id} value={p.providerId || p.id}>
                        {p.name || p.user?.name} ({p.role || p.category || 'Tech'} - Trust {p.trustScore}%)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <form onSubmit={handleBookingSubmit}>
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
                      <option value="09:00 AM">09:00 AM - 11:00 AM</option>
                      <option value="10:00 AM">10:00 AM - 12:00 PM</option>
                      <option value="02:00 PM">02:00 PM - 04:00 PM</option>
                      <option value="05:00 PM">05:00 PM - 07:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Service Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0"><MapPin size={18} className="text-muted" /></span>
                  <input 
                    type="text" 
                    className="form-control border-start-0 py-2" 
                    placeholder="Enter full flat / street address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              {/* Emergency Option Checkbox */}
              <div className="form-check form-switch p-3 bg-fixmate-orange-light rounded-3 border border-warning border-opacity-50 mb-4">
                <input 
                  className="form-check-input ms-0 me-2" 
                  type="checkbox" 
                  id="emergencyCheck"
                  checked={emergency}
                  onChange={(e) => setEmergency(e.target.checked)}
                />
                <label className="form-check-label fw-bold text-dark" htmlFor="emergencyCheck">
                  <Zap size={16} fill="currentColor" className="text-fixmate-orange me-1 d-inline" /> Mark as Emergency Request (+₹100 for auto-dispatch within 15 mins)
                </label>
              </div>

              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                <div>
                  <span className="text-muted small d-block">Total Estimated Cost</span>
                  <span className="fw-extrabold fs-3 text-dark">
                    ₹{(currentService?.price ? Number(currentService.price) : 0) + (emergency ? 100 : 0)}
                  </span>
                </div>
                <button type="submit" className="btn btn-fixmate-primary btn-lg rounded-pill px-5 fw-bold" disabled={loading}>
                  {loading ? 'Confirming Booking...' : 'Confirm Booking'} <ArrowRight size={18} className="ms-1 d-inline" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
