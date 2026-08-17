import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Zap, ShieldCheck, Plus, Bell, Users, CheckCircle } from 'lucide-react';
import BookingCard from '../components/BookingCard';
import { apiService } from '../services/api';

export default function CustomerDashboard({ setCurrentPage, setTrackedBooking, onOpenEmergency, user }) {
  const [bookings, setBookings] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [societyBookings, setSocietyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      const customerId = user?.userId || user?.id;
      
      const [bData, remData, socData] = await Promise.all([
        apiService.getCustomerBookings(customerId),
        apiService.getReminders(customerId),
        apiService.getSocietyBookings()
      ]);
      
      if (Array.isArray(bData)) {
        setBookings(bData.map(b => ({
          id: b.bookingId ? `FM-${b.bookingId}` : (b.id || 'FM-1001'),
          serviceName: b.service?.serviceName || b.serviceName || 'Home Service',
          category: b.service?.category || b.category || 'General',
          providerName: b.provider?.name || b.provider?.user?.name || b.providerName || 'Assigned Technician',
          providerPhone: b.provider?.phone || b.provider?.user?.phone || b.providerPhone || 'N/A',
          date: b.bookingDate ? b.bookingDate.split('T')[0] : 'Scheduled',
          time: b.bookingDate && b.bookingDate.includes('T') ? b.bookingDate.split('T')[1].substring(0, 5) : '10:00 AM',
          status: b.status || 'REQUESTED',
          emergency: b.emergencyFlag || false,
          amount: b.service?.price || b.amount || 0,
          address: b.address || 'Customer Address'
        })));
      }

      if (Array.isArray(remData)) {
        setReminders(remData);
      }

      if (Array.isArray(socData)) {
        setSocietyBookings(socData);
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
            <h2 className="fw-extrabold text-white mb-1">Hello, {user?.name || 'Customer'} 👋</h2>
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
            <div className="text-center py-5 text-muted">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div> Loading your bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-5 text-muted card card-fixmate p-5">
              <Calendar size={40} className="text-muted mx-auto mb-3 opacity-50" />
              <h6 className="fw-bold text-dark">No active bookings found</h6>
              <p className="small mb-3">You have not scheduled any service appointments yet.</p>
              <div>
                <button className="btn btn-fixmate-primary btn-sm rounded-pill px-4" onClick={() => setCurrentPage('services')}>
                  Book Your First Service
                </button>
              </div>
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

            {reminders.length === 0 ? (
              <p className="text-muted small mb-0 py-2 text-center">No upcoming maintenance reminders.</p>
            ) : (
              reminders.slice(0, 3).map((rem) => (
                <div key={rem.reminderId || rem.id} className="p-2 mb-2 rounded-3 bg-light border border-light">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold text-dark small">{rem.service?.serviceName || rem.service || 'Scheduled Service'}</span>
                    <span className={`badge ${rem.status === 'OVERDUE' ? 'bg-danger' : 'bg-warning text-dark'} small`}>
                      {rem.status}
                    </span>
                  </div>
                  <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Due Date: {rem.reminderDate || rem.dueDate}</small>
                </div>
              ))
            )}
          </div>

          {/* Society Booking Banner */}
          <div className="card card-fixmate p-3 bg-primary bg-opacity-10 border-primary border-opacity-25">
            <h6 className="fw-bold text-primary mb-1 d-flex align-items-center gap-1">
              <Users size={16} /> Society Group Deals
            </h6>
            {societyBookings.length > 0 ? (
              <>
                <p className="text-dark small mb-2">
                  Active deal in <strong>{societyBookings[0].societyName}</strong> for {societyBookings[0].service?.serviceName || 'Maintenance'} ({societyBookings[0].discountPercentage}% OFF)!
                </p>
                <button className="btn btn-primary btn-sm rounded-pill w-100 fw-bold" onClick={() => setCurrentPage('society')}>
                  Join Group Booking
                </button>
              </>
            ) : (
              <>
                <p className="text-dark small mb-2">Combine service requests with your society neighbors to unlock group discounts!</p>
                <button className="btn btn-primary btn-sm rounded-pill w-100 fw-bold" onClick={() => setCurrentPage('society')}>
                  View Society Deals
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
