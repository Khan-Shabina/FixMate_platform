import React, { useState, useEffect } from 'react';
import { Users, Building, ShieldCheck, Tag, CheckCircle2, ArrowRight, Plus } from 'lucide-react';
import { apiService } from '../services/api';

export default function CommunityBooking({ setCurrentPage, user }) {
  const [societyBookings, setSocietyBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const fetchSocietyBookings = async () => {
    setLoading(true);
    const data = await apiService.getSocietyBookings();
    if (Array.isArray(data)) {
      setSocietyBookings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSocietyBookings();
  }, []);

  const handleJoin = async (id) => {
    const customerId = user?.userId || user?.id || 1;
    const res = await apiService.joinSocietyBooking(id, customerId);
    if (res.success || res.data) {
      setJoined(prev => ({ ...prev, [id]: true }));
      setSuccessMsg('Successfully joined the society group discount! An individual discounted booking has been added to your dashboard.');
      fetchSocietyBookings();
    }
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

      {successMsg && (
        <div className="alert alert-success alert-dismissible fade show max-w-2xl mx-auto mb-4" role="alert">
          <CheckCircle2 size={18} className="me-2 d-inline" /> {successMsg}
          <button type="button" className="btn-close" onClick={() => setSuccessMsg('')}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border spinner-border-sm me-2" role="status"></div> Loading active society group deals...
        </div>
      ) : societyBookings.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4 max-w-md mx-auto p-5">
          <Building size={48} className="text-muted mx-auto mb-3 opacity-50" />
          <h5 className="fw-bold text-dark">No Active Society Group Deals</h5>
          <p className="text-muted small mb-4">Be the first resident to initiate a bulk service discount for your residential complex.</p>
          <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={() => setCurrentPage('services')}>
            Explore Services to Start Group Deal
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {societyBookings.map((group) => {
            const groupId = group.societyBookingId || group.id;
            const isJoined = joined[groupId];
            const memberCount = group.membersCount || 1;
            const discountPct = group.discountPercentage || 15;
            const basePrice = Number(group.service?.price || 1000);
            const discountedPrice = Math.round(basePrice * (1 - discountPct / 100));

            return (
              <div className="col-lg-6" key={groupId}>
                <div className="card card-fixmate p-4 h-100 border-2 border-primary border-opacity-25">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge bg-primary text-white px-3 py-1.5 rounded-pill fw-bold">
                      <Building size={14} className="me-1 d-inline" /> {group.societyName}
                    </span>
                    <span className="badge bg-success text-white px-3 py-1.5 rounded-pill fw-bold">
                      <Tag size={14} className="me-1 d-inline" /> {discountPct}% Group Discount
                    </span>
                  </div>

                  <h4 className="fw-extrabold text-dark mb-2">{group.service?.serviceName || 'Community Maintenance'}</h4>
                  <p className="text-muted small mb-3">Scheduled Date: <strong>{group.bookingDate}</strong></p>

                  {/* Progress & Count */}
                  <div className="bg-light p-3 rounded-3 mb-4 border">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="small fw-bold text-dark d-flex align-items-center gap-1">
                        <Users size={16} className="text-primary" /> {memberCount} Residents Joined
                      </span>
                      <span className="small text-muted">Target: 10+ for 25% OFF</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar bg-success" 
                        role="progressbar" 
                        style={{ width: `${Math.min(100, (memberCount / 10) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
                    <div>
                      <span className="text-decoration-line-through text-muted small me-2">₹{basePrice}</span>
                      <span className="fw-extrabold fs-4 text-success">₹{discountedPrice}</span>
                      <span className="text-muted small ms-1">/ apartment</span>
                    </div>

                    <button 
                      className={`btn rounded-pill px-4 fw-bold ${isJoined ? 'btn-success disabled' : 'btn-fixmate-primary'}`}
                      onClick={() => handleJoin(groupId)}
                      disabled={isJoined}
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
      )}
    </div>
  );
}
