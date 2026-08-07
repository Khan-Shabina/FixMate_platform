import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { mockServices, mockProviders } from '../data/mockData';
import { apiService } from '../services/api';

export default function Booking({ selectedService, selectedProvider, setCurrentPage, setTrackedBooking }) {
  const service = selectedService || mockServices[0];
  const provider = selectedProvider || mockProviders[0];

  const [date, setDate] = useState('2026-08-10');
  const [time, setTime] = useState('10:00 AM');
  const [address, setAddress] = useState('Flat 402, Green Valley Society, Andheri East, Mumbai');
  const [emergency, setEmergency] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newBooking = await apiService.createBooking({
      serviceName: service.name,
      category: service.category,
      providerName: provider.name,
      providerPhone: provider.phone,
      date,
      time,
      address,
      emergency,
      amount: service.price + (emergency ? 100 : 0)
    });
    setLoading(false);
    setTrackedBooking(newBooking);
    setCurrentPage('tracking');
  };

  return (
    <div className="container py-5">
      <div className="row g-4 justify-content-center">
        <div className="col-lg-8">
          <div className="card card-fixmate border-0 shadow-lg p-4 p-md-5">
            <h3 className="fw-extrabold text-dark mb-4">Book Service Appointment</h3>

            {/* Service & Worker Summary Box */}
            <div className="bg-light p-3 rounded-3 border mb-4 d-flex align-items-center justify-content-between">
              <div>
                <span className="badge bg-primary mb-1">{service.category}</span>
                <h5 className="fw-bold text-dark mb-0">{service.name}</h5>
                <small className="text-muted">Assigned Worker: <strong>{provider.name}</strong> (Trust Score: {provider.trustScore}%)</small>
              </div>
              <div className="text-end">
                <span className="text-muted small d-block">Base Price</span>
                <span className="fw-extrabold fs-4 text-dark">₹{service.price}</span>
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
                  <input type="text" className="form-control border-start-0 py-2" value={address} onChange={(e) => setAddress(e.target.value)} required />
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
                  <Zap size={16} fill="currentColor" className="text-fixmate-orange me-1 d-inline" /> Mark as Emergency Request (+₹100 for immediate response within 15 mins)
                </label>
              </div>

              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                <div>
                  <span className="text-muted small d-block">Total Estimated Cost</span>
                  <span className="fw-extrabold fs-3 text-dark">₹{service.price + (emergency ? 100 : 0)}</span>
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
