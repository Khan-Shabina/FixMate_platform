import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Zap, ShieldCheck, Plus, Bell, Users, CheckCircle } from 'lucide-react';
import BookingCard from '../components/BookingCard';
import { mockBookings, mockReminders } from '../data/mockData';
import { apiService } from '../services/api';

export default function CustomerDashboard({ setCurrentPage, setTrackedBooking, onOpenEmergency, user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      const customerId = user?.userId || user?.id;
      const bData = await apiService.getCustomerBookings(customerId);
      
      if (Array.isArray(bData) && bData.length > 0) {
        setBookings(bData.map(b => ({
          id: b.bookingId ? `FM-${b.bookingId}` : (b.id || 'FM-2841'),
          serviceName: b.service?.serviceName || b.serviceName || 'Home Service',
          category: b.service?.category || b.category || 'General',
          providerName: b.provider?.name || b.providerName || 'Assigned Technician',
          providerPhone: b.provider?.phone || b.providerPhone || '+91 98200 11223',
          date: b.bookingDate ? b.bookingDate.split('T')[0] : '2026-08-14',
          time: '10:00 AM',
          status: b.status || 'REQUESTED',
          emergency: b.emergencyFlag || false,
          amount: b.service?.price || b.amount || 499,
          address: b.address || 'Flat 402, Green Valley Society, Andheri East, Mumbai'
        })));
      } else {
        setBookings(mockBookings);
      }
      setLoading(false);
    };

    fetchCustomerData();
  }, [user]);

  return (
    <div className="container py-5">
      {/* Header Banner */}
      <div className="bg-fixmate-navy text-white p-4 p-md-5 rounded-4 shadow-sm mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge bg-warning text-dark fw-bold mb-2">Customer Portal</span>
            <h2 className="fw-extrabold text-white mb-1">Hello, {user?.name || 'Valued Customer'} 👋</h2>
            <p className="text-light opacity-75 mb-0">Manage your active service bookings, upcoming maintenance reminders, and community society deals.</p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-md-end">
            <button className="btn btn-emergency btn-sm px-3" onClick={onOpenEmergency}>
              <Zap size={16} fill="currentColor" className="me-1" /> Emergency
            </button>
            <button className="btn btn-light text-dark btn-sm rounded-pill px-3 fw-bold" onClick={() => setCurrentPage('services')}>
              <Plus size={16} className="me-1" /> Book Service
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Active Bookings Column */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold text-dark mb-0">My Active & Recent Bookings</h5>
            <span className="badge bg-primary rounded-pill px-3">{bookings.length} Total</span>
          </div>

          {loading ? (
            <div className="text-center py-4 text-muted">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div> Loading your bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-4 text-muted card card-fixmate p-4">
              No active bookings found. Click "Book Service" to request your first service!
            </div>
          ) : (
            bookings.map((booking) => (
              <BookingCard 
                key={booking.id}
                booking={booking}
                onTrack={(b) => {
                  setTrackedBooking(b);
                  setCurrentPage('tracking');
                }}
              />
            ))
          )}
        </div>

        {/* Reminders & Society Quick Sidebar */}
        <div className="col-lg-4">
          {/* Maintenance Reminders Box */}
          <div className="card card-fixmate p-3 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-1">
                <Bell size={16} className="text-warning" /> Service Reminders
              </h6>
              <button className="btn btn-link p-0 text-primary small text-decoration-none fw-bold" onClick={() => setCurrentPage('reminders')}>
                View All
              </button>
            </div>

            {mockReminders.map((rem) => (
              <div key={rem.id} className="p-2 mb-2 rounded-3 bg-light border border-light">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-bold text-dark small">{rem.service}</span>
                  <span className={`badge ${rem.status === 'Overdue' ? 'bg-danger' : 'bg-warning text-dark'} small`}>
                    {rem.status}
                  </span>
                </div>
                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Due Date: {rem.dueDate}</small>
              </div>
            ))}
          </div>

          {/* Society Booking Banner */}
          <div className="card card-fixmate p-3 bg-primary bg-opacity-10 border-primary border-opacity-25">
            <h6 className="fw-bold text-primary mb-1 d-flex align-items-center gap-1">
              <Users size={16} /> Society Group Deal
            </h6>
            <p className="text-dark small mb-2">Join 14 residents in <strong>Green Valley Society</strong> for Pest Control & get 20% OFF!</p>
            <button className="btn btn-primary btn-sm rounded-pill w-100 fw-bold" onClick={() => setCurrentPage('society')}>
              Join Group Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
