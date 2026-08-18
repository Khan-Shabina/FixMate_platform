import React, { useState, useEffect } from 'react';
import { Plus, Bell, CheckCircle2, Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function MaintenanceReminder({ setCurrentPage, setSelectedService, user }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchReminders = async () => {
    setLoading(true);
    setErrorMsg('');
    const customerId = user?.userId || user?.id || 1;
    const data = await apiService.getReminders(customerId);
    if (Array.isArray(data)) {
      setReminders(data);
    } else {
      setErrorMsg('Failed to load maintenance reminders');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReminders();
  }, [user]);

  const handleComplete = async (reminderId) => {
    setActionMsg('');
    const result = await apiService.completeReminder(reminderId);
    if (result.success) {
      setActionMsg('Maintenance reminder marked as completed!');
      fetchReminders();
    } else {
      setErrorMsg(result.error || 'Failed to update reminder status');
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'OVERDUE') {
      return <span className="badge bg-danger text-white rounded-pill px-3 py-1 fw-bold">⚠️ Overdue</span>;
    } else if (s === 'COMPLETED') {
      return <span className="badge bg-success text-white rounded-pill px-3 py-1 fw-bold">✓ Completed</span>;
    }
    return <span className="badge bg-warning text-dark rounded-pill px-3 py-1 fw-bold">⏰ Upcoming</span>;
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
        <div>
          <span className="badge bg-warning text-dark fw-bold mb-1">Preventive Care Engine</span>
          <h2 className="fw-extrabold text-dark mb-0">Maintenance Reminders</h2>
          <p className="text-muted small">Automatically scheduled periodic maintenance for AC cooling coils, water purifier filters, and pest control.</p>
        </div>
        <button 
          className="btn btn-fixmate-primary rounded-pill px-4 fw-bold"
          onClick={() => setCurrentPage('services')}
        >
          <Plus size={16} className="me-1" /> Browse Maintenance Services
        </button>
      </div>

      {actionMsg && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
          <CheckCircle2 size={18} /> {actionMsg}
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5 text-muted card card-fixmate p-5">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div> Loading maintenance reminders...
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-5 text-muted card card-fixmate p-5">
          <Bell size={44} className="text-muted mb-2 mx-auto" />
          <h5 className="fw-bold text-dark mb-1">All Caught Up!</h5>
          <p className="small text-muted mb-3">No active maintenance reminders. When you complete bookings for AC, RO purifier, or Pest control, FixMate automatically schedules your recurring preventive reminders.</p>
          <button className="btn btn-fixmate-primary btn-sm rounded-pill px-4 fw-bold mx-auto" onClick={() => setCurrentPage('services')}>
            Book a Service Now
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {reminders.map((reminder) => {
            const isCompleted = (reminder.status || '').toUpperCase() === 'COMPLETED';
            const isOverdue = (reminder.status || '').toUpperCase() === 'OVERDUE';

            return (
              <div className="col-md-4" key={reminder.reminderId}>
                <div className={`card card-fixmate p-4 h-100 position-relative overflow-hidden ${isOverdue ? 'border-danger border-2' : ''}`}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge bg-light text-primary border px-3 py-1 rounded-pill small fw-bold">
                      {reminder.service?.category || 'Home Appliance'}
                    </span>
                    {getStatusBadge(reminder.status)}
                  </div>

                  <h5 className="fw-bold text-dark mb-2">{reminder.service?.serviceName || 'Service Maintenance'}</h5>
                  
                  <div className="bg-light p-3 rounded-3 mb-3 text-muted small">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span>Scheduled Due Date:</span>
                      <strong className="text-dark">{reminder.reminderDate}</strong>
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <span>Estimated Service Rate:</span>
                      <strong className="text-dark">₹{reminder.service?.price || 499}</strong>
                    </div>
                  </div>

                  <div className="mt-auto d-flex flex-column gap-2">
                    {!isCompleted && (
                      <button 
                        className="btn btn-outline-success btn-sm rounded-pill fw-bold w-100"
                        onClick={() => handleComplete(reminder.reminderId)}
                      >
                        ✓ Mark as Serviced / Done
                      </button>
                    )}

                    <button 
                      className="btn btn-outline-primary btn-sm rounded-pill fw-bold w-100"
                      onClick={() => {
                        if (setSelectedService && reminder.service) {
                          setSelectedService(reminder.service);
                        }
                        setCurrentPage('booking');
                      }}
                    >
                      Schedule Service Appointment →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
