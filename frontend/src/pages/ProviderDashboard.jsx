import React, { useState } from 'react';
import { DollarSign, CheckCircle, Star, ShieldCheck, ToggleLeft, ToggleRight, ListCheck, Wrench, Clock } from 'lucide-react';
import { mockBookings } from '../data/mockData';

export default function ProviderDashboard({ setCurrentPage, user }) {
  const [available, setAvailable] = useState(true);

  return (
    <div className="container py-5">
      {/* Header Banner */}
      <div className="bg-fixmate-navy text-white p-4 p-md-5 rounded-4 shadow-sm mb-4">
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge bg-info text-dark fw-bold mb-2">Service Provider Portal</span>
            <h2 className="fw-extrabold text-white mb-1">{user?.name || 'Service Provider'}</h2>
            <p className="text-light opacity-75 mb-0">Location: <strong>Andheri East, Mumbai</strong> | Trust Score: <span className="text-warning fw-bold">97%</span></p>
          </div>

          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            {/* Availability Toggle */}
            <div className="bg-white bg-opacity-10 p-3 rounded-3 border border-white border-opacity-20 d-inline-block text-start">
              <span className="small text-white-50 d-block mb-1">Availability Status</span>
              <button 
                className={`btn btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-2 ${available ? 'btn-success' : 'btn-danger'}`}
                onClick={() => setAvailable(!available)}
              >
                {available ? '🟢 Available Now' : '🔴 Busy / Off-Duty'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="row g-4 mb-5 text-center">
        <div className="col-md-3">
          <div className="card card-fixmate p-3">
            <h3 className="fw-extrabold text-success mb-1">₹34,500</h3>
            <span className="text-muted small">Total Earnings</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card card-fixmate p-3">
            <h3 className="fw-extrabold text-primary mb-1">342</h3>
            <span className="text-muted small">Completed Jobs</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card card-fixmate p-3">
            <h3 className="fw-extrabold text-warning mb-1">⭐ 4.9</h3>
            <span className="text-muted small">Customer Rating</span>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card card-fixmate p-3">
            <h3 className="fw-extrabold text-info mb-1">97%</h3>
            <span className="text-muted small">Trust Score</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="d-flex gap-3 mb-4">
        <button className="btn btn-fixmate-primary rounded-pill px-4 fw-bold" onClick={() => setCurrentPage('provider-bookings')}>
          <ListCheck size={18} className="me-1 d-inline" /> Manage Customer Requests ({mockBookings.length})
        </button>
        <button className="btn btn-outline-secondary rounded-pill px-4 fw-bold" onClick={() => setCurrentPage('manage-services')}>
          <Wrench size={18} className="me-1 d-inline" /> Edit Offered Services & Rates
        </button>
      </div>

      {/* Incoming Booking Requests */}
      <div className="card card-fixmate p-4">
        <h5 className="fw-bold text-dark mb-3">Recent Customer Job Requests</h5>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Booking ID</th>
                <th>Service Name</th>
                <th>Address</th>
                <th>Date & Time</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockBookings.map((b) => (
                <tr key={b.id}>
                  <td className="fw-bold">{b.id}</td>
                  <td>{b.serviceName}</td>
                  <td className="small">{b.address}</td>
                  <td className="small">{b.date} ({b.time})</td>
                  <td>
                    <span className={`badge ${b.emergency ? 'bg-danger' : 'bg-secondary'} rounded-pill`}>
                      {b.emergency ? '⚡ Emergency' : 'Standard'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary rounded-pill fw-bold" onClick={() => setCurrentPage('provider-bookings')}>
                      Manage Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
