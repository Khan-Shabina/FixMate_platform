import React, { useState, useEffect } from 'react';
import { Calendar, Bell, Clock, CheckCircle, Plus, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';

export default function MaintenanceReminder({ setCurrentPage, setSelectedService, user }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReminders = async () => {
      setLoading(true);
      const customerId = user?.userId || user?.id;
      const data = await apiService.getReminders(customerId);
      if (Array.isArray(data)) {
        setReminders(data);
      }
      setLoading(false);
    };
    fetchReminders();
  }, [user]);

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
        <div>
          <span className="badge bg-warning text-dark fw-bold mb-1">Preventive Care</span>
          <h2 className="fw-extrabold text-dark mb-0">Maintenance Reminders</h2>
          <p className="text-muted small">Automatic and custom scheduling for periodic AC servicing, water purifier filter changes, and pest control.</p>
        </div>
        <button className="btn btn-fixmate-primary rounded-pill px-4 fw-bold" onClick={() => setCurrentPage('services')}>
          <Plus size={16} className="me-1" /> Schedule New Service
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div> Loading maintenance reminders...
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 max-w-lg mx-auto p-5">
          <Bell size={48} className="text-warning mb-3 opacity-50" />
          <h5 className="fw-bold text-dark">No Active Maintenance Reminders</h5>
          <p className="text-muted small mb-4">
            Whenever a service (such as AC cleaning or Water Purifier maintenance) is completed, our system automatically schedules your next periodic checkup reminder here.
          </p>
          <button className="btn btn-outline-primary rounded-pill px-4 fw-bold" onClick={() => setCurrentPage('services')}>
            Explore Services
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {reminders.map((reminder) => (
            <div className="col-md-4" key={reminder.reminderId || reminder.id}>
              <div className="card card-fixmate p-4 h-100 position-relative overflow-hidden">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge bg-light text-primary border px-3 py-1 rounded-pill small fw-bold">
                    {reminder.service?.category || 'Maintenance'}
                  </span>
                  <span className={`badge ${reminder.status === 'OVERDUE' ? 'bg-danger text-white' : 'bg-warning bg-opacity-25 text-dark'} rounded-pill px-3 py-1 fw-bold`}>
                    {reminder.status === 'OVERDUE' ? '⚠️ Overdue' : '⏰ Scheduled'}
                  </span>
                </div>

                <h5 className="fw-bold text-dark mb-2">{reminder.service?.serviceName || 'Service Checkup'}</h5>
                
                <div className="bg-light p-3 rounded-3 mb-3 text-muted small">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span>Scheduled Due Date:</span>
                    <strong className="text-dark">{reminder.reminderDate || reminder.dueDate}</strong>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span>Status:</span>
                    <strong className="text-dark">{reminder.status || 'PENDING'}</strong>
                  </div>
                </div>

                <button 
                  className="btn btn-outline-primary w-100 rounded-pill fw-bold mt-auto"
                  onClick={() => {
                    if (reminder.service) setSelectedService(reminder.service);
                    setCurrentPage('booking');
                  }}
                >
                  Schedule Service Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
