import React from 'react';
import { Calendar, Bell, Clock, CheckCircle, Plus, AlertCircle } from 'lucide-react';
import { mockReminders } from '../data/mockData';

export default function MaintenanceReminder({ setCurrentPage, setSelectedService }) {
  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
        <div>
          <span className="badge bg-warning text-dark fw-bold mb-1">Preventive Care</span>
          <h2 className="fw-extrabold text-dark mb-0">Maintenance Reminders</h2>
          <p className="text-muted small">Never miss periodic AC servicing, water purifier filter changes, or pest control sprays.</p>
        </div>
        <button className="btn btn-fixmate-primary rounded-pill px-4 fw-bold">
          <Plus size={16} className="me-1" /> Add Custom Reminder
        </button>
      </div>

      <div className="row g-4">
        {mockReminders.map((reminder) => (
          <div className="col-md-4" key={reminder.id}>
            <div className="card card-fixmate p-4 h-100 position-relative overflow-hidden">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="badge bg-light text-primary border px-3 py-1 rounded-pill small fw-bold">
                  {reminder.category}
                </span>
                <span className={`badge ${reminder.status === 'Overdue' ? 'bg-danger text-white' : 'bg-warning bg-opacity-25 text-dark'} rounded-pill px-3 py-1 fw-bold`}>
                  {reminder.status === 'Overdue' ? '⚠️ Overdue' : '⏰ Upcoming'}
                </span>
              </div>

              <h5 className="fw-bold text-dark mb-2">{reminder.service}</h5>
              
              <div className="bg-light p-3 rounded-3 mb-3 text-muted small">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span>Scheduled Due Date:</span>
                  <strong className="text-dark">{reminder.dueDate}</strong>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <span>Recommended Frequency:</span>
                  <strong className="text-dark">{reminder.recommendedFrequency}</strong>
                </div>
              </div>

              <button 
                className="btn btn-outline-primary w-100 rounded-pill fw-bold mt-auto"
                onClick={() => {
                  setCurrentPage('services');
                }}
              >
                Schedule Service Now →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
