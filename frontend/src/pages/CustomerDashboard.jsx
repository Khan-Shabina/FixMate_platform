import React, { useState, useEffect } from 'react';
import { Zap, Plus, Bell, Users, Calendar, AlertCircle } from 'lucide-react';
import BookingCard from '../components/BookingCard';
import { apiService } from '../services/api';

export default function CustomerDashboard({ setCurrentPage, setTrackedBooking, onOpenEmergency, user }) {
  const [bookings, setBookings] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [societyBookings, setSocietyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCustomerData = async () => {
    setLoading(true);
    setError('');
    try {
      const customerId = user?.userId || user?.id;
      const [bData, rData, sData] = await Promise.all([
        apiService.getCustomerBookings(customerId),
        apiService.getReminders(customerId),
        apiService.getSocietyBookings()
      ]);

      if (Array.isArray(bData)) {
        setBookings(bData.map(b => ({
          id: `FM-${b.bookingId}`,
          rawBookingId: b.bookingId,
          serviceName: b.service?.serviceName || 'Home Service',
          category: b.service?.category || 'General',
          providerName: b.provider?.name || (b.provider?.user ? b.provider.user.name : 'Assigned Technician'),
          providerPhone: b.provider?.phone || (b.provider?.user ? b.provider.user.phone : ''),
          date: b.bookingDate ? b.bookingDate.split('T')[0] : '',
          time: b.bookingDate && b.bookingDate.includes('T') ? b.bookingDate.split('T')[1].substring(0, 5) : '',
          status: b.status || 'REQUESTED',
          emergency: b.emergencyFlag || false,
          amount: b.service?.price || 0,
          address: b.address || 'Address provided'
        })));
      }

      if (Array.isArray(rData)) {
        setReminders(rData);
      }

      if (Array.isArray(sData)) {
        setSocietyBookings(sData);
      }
    } catch {
      setError('Unable to load your dashboard data. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [user]);

  const activeGroupDeal = societyBookings.length > 0 ? societyBookings[0] : null;

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
          <div className="col-md-4 text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-md-end flex-wrap">
            <button className="btn btn-emergency btn-sm px-3" onClick={onOpenEmergency}>
              <Zap size={16} fill="currentColor" className="me-1" /> 24/7 Emergency
            </button>
            <button className="btn btn-light text-dark btn-sm rounded-pill px-3 fw-bold" onClick={() => setCurrentPage('services')}>
              <Plus size={16} className="me-1" /> Book Service
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="row g-4">
        {/* Active Bookings Column */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="fw-bold text-dark mb-0">My Service Bookings</h5>
            <span className="badge bg-primary rounded-pill px-3">{bookings.length} Total</span>
          </div>

          {loading ? (
            <div className="text-center py-5 text-muted card card-fixmate p-4">
              <div className="spinner-border spinner-border-sm me-2 text-primary" role="status"></div> Loading your bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-5 text-muted card card-fixmate p-5">
              <Calendar size={40} className="text-muted mb-2 mx-auto" />
              <h6 className="fw-bold text-dark mb-1">No bookings yet</h6>
              <p className="small text-muted mb-3">Book a trusted professional for maintenance, repairs, or emergency fixes in minutes.</p>
              <button className="btn btn-fixmate-primary btn-sm rounded-pill px-4 fw-bold mx-auto" onClick={() => setCurrentPage('services')}>
                Browse Services Catalog
              </button>
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
                onReviewSuccess={fetchCustomerData}
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

            {loading ? (
              <div className="text-center py-3 text-muted small">
                <div className="spinner-border spinner-border-sm me-1 text-warning"></div> Loading reminders...
              </div>
            ) : reminders.length === 0 ? (
              <div className="p-3 bg-light rounded-3 text-center text-muted small">
                You're all caught up! No pending maintenance reminders.
              </div>
            ) : (
              reminders.slice(0, 3).map((rem) => (
                <div key={rem.reminderId} className="p-2 mb-2 rounded-3 bg-light border border-light">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold text-dark small">{rem.service?.serviceName || 'Service Reminder'}</span>
                    <span className={`badge ${rem.status === 'OVERDUE' ? 'bg-danger' : rem.status === 'COMPLETED' ? 'bg-success' : 'bg-warning text-dark'} small`}>
                      {rem.status}
                    </span>
                  </div>
                  <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Due Date: {rem.reminderDate}</small>
                </div>
              ))
            )}
          </div>

          {/* Society Booking Banner */}
          <div className="card card-fixmate p-3 bg-primary bg-opacity-10 border-primary border-opacity-25">
            <h6 className="fw-bold text-primary mb-1 d-flex align-items-center gap-1">
              <Users size={16} /> Society Group Deal
            </h6>
            {activeGroupDeal ? (
              <>
                <p className="text-dark small mb-2">
                  Join <strong>{activeGroupDeal.membersCount}</strong> residents in <strong>{activeGroupDeal.societyName}</strong> for {activeGroupDeal.service?.serviceName || 'Maintenance'} & get <strong>{activeGroupDeal.discountPercentage}% OFF</strong>!
                </p>
                <button className="btn btn-primary btn-sm rounded-pill w-100 fw-bold" onClick={() => setCurrentPage('society')}>
                  View Society Deals
                </button>
              </>
            ) : (
              <>
                <p className="text-dark small mb-2">Group bookings with society neighbors unlock up to 25% bulk discounts!</p>
                <button className="btn btn-primary btn-sm rounded-pill w-100 fw-bold" onClick={() => setCurrentPage('society')}>
                  Explore Group Deals
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
