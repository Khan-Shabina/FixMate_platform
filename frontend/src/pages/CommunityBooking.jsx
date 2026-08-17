import React, { useState } from 'react';
import { Users, Building, Tag, CheckCircle2 } from 'lucide-react';
import { mockSocietyBookings } from '../data/mockData';

export default function CommunityBooking({ setCurrentPage: _setCurrentPage }) {
  const [joined, setJoined] = useState({});

  const handleJoin = (id) => {
    setJoined(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="container py-5">
      <div className="text-center max-w-2xl mx-auto mb-5">
        <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1.5 rounded-pill mb-2">
          🏢 Group Discount Engine
        </span>
        <h2 className="fw-extrabold text-dark display-6">Community Society Bookings</h2>
        <p className="text-muted">Combine service requests with your apartment society neighbors to unlock up to 25% group bulk discounts!</p>
      </div>

      <div className="row g-4">
        {mockSocietyBookings.map((group) => {
          const isJoined = joined[group.id];
          const residentCount = group.joinedResidents + (isJoined ? 1 : 0);

          return (
            <div className="col-lg-6" key={group.id}>
              <div className="card card-fixmate p-4 h-100 border-2 border-primary border-opacity-25">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="badge bg-primary text-white px-3 py-1.5 rounded-pill fw-bold">
                    <Building size={14} className="me-1 d-inline" /> {group.societyName}
                  </span>
                  <span className="badge bg-success text-white px-3 py-1.5 rounded-pill fw-bold">
                    <Tag size={14} className="me-1 d-inline" /> {group.targetDiscount} Group Discount
                  </span>
                </div>

                <h4 className="fw-extrabold text-dark mb-2">{group.service}</h4>
                <p className="text-muted small mb-3">Service Date: <strong>{group.date}</strong></p>

                {/* Progress & Count */}
                <div className="bg-light p-3 rounded-3 mb-4 border">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small fw-bold text-dark d-flex align-items-center gap-1">
                      <Users size={16} className="text-primary" /> {residentCount} Residents Joined
                    </span>
                    <span className="small text-muted">Target: 20 Residents</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${(residentCount / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
                  <div>
                    <span className="text-decoration-line-through text-muted small me-2">₹{group.originalPrice}</span>
                    <span className="fw-extrabold fs-4 text-success">₹{group.groupPrice}</span>
                    <span className="text-muted small ms-1">/ apartment</span>
                  </div>

                  <button 
                    className={`btn rounded-pill px-4 fw-bold ${isJoined ? 'btn-success disabled' : 'btn-fixmate-primary'}`}
                    onClick={() => handleJoin(group.id)}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle2 size={16} className="me-1 d-inline" /> Joined Group
                      </>
                    ) : (
                      'Join Society Deal →'
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
