import React, { useState, useEffect } from 'react';
import { Users, Building, Tag, CheckCircle2, Plus, AlertCircle, Calendar } from 'lucide-react';
import { apiService } from '../services/api';

export default function CommunityBooking({ setCurrentPage, user }) {
  const [societyGroups, setSocietyGroups] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinedMap, setJoinedMap] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [societyName, setSocietyName] = useState('Green Valley Society, Andheri');
  const [serviceId, setServiceId] = useState('');
  const [bookingDate, setBookingDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [creating, setCreating] = useState(false);
  const [joiningId, setJoiningId] = useState(null);
  const [actionMsg, setActionMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [gData, sData] = await Promise.all([
        apiService.getSocietyBookings(),
        apiService.getServices()
      ]);
      if (Array.isArray(gData)) {
        setSocietyGroups(gData);
      }
      if (Array.isArray(sData) && sData.length > 0) {
        setServices(sData);
        if (!serviceId) {
          setServiceId(sData[0].serviceId || sData[0].id);
        }
      }
    } catch {
      setErrorMsg('Failed to load society booking groups.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleJoin = async (groupId) => {
    setErrorMsg('');
    setActionMsg('');
    setJoiningId(groupId);
    const customerId = user?.userId || user?.id || 1;
    const result = await apiService.joinSocietyBooking(groupId, customerId);
    setJoiningId(null);
    if (result.success) {
      setJoinedMap(prev => ({ ...prev, [groupId]: true }));
      setActionMsg('Successfully joined society booking! An individual discounted booking has been created for your account.');
      loadData();
    } else {
      setErrorMsg(result.error || 'Failed to join society group');
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setCreating(true);
    setErrorMsg('');
    setActionMsg('');
    const customerId = user?.userId || user?.id || 1;
    const result = await apiService.createSocietyBooking({
      customerId,
      serviceId: Number(serviceId),
      societyName: societyName.trim(),
      bookingDate
    });
    setCreating(false);
    if (result.success) {
      setShowCreateModal(false);
      setActionMsg('New society booking group initialized successfully! Share with your apartment neighbors.');
      loadData();
    } else {
      setErrorMsg(result.error || 'Failed to create society group');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-5 gap-3">
        <div className="text-start max-w-2xl">
          <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-1.5 rounded-pill mb-2">
            🏢 Dynamic Group Discount Engine
          </span>
          <h2 className="fw-extrabold text-dark display-6 mb-1">Community Society Bookings</h2>
          <p className="text-muted mb-0">Combine service requests with your apartment society neighbors to unlock up to 25% bulk discounts!</p>
        </div>
        <button 
          className="btn btn-fixmate-primary rounded-pill px-4 fw-bold shadow-sm"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} className="me-1 d-inline" /> Start New Society Group
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

      {/* Discount Tiers Banner */}
      <div className="card card-fixmate p-3 bg-light border mb-4">
        <div className="row g-2 text-center small fw-bold">
          <div className="col-md-4">
            <div className="p-2 bg-white rounded-3 border">
              <span className="text-secondary">1 – 4 Residents:</span> <span className="text-primary fs-6">15% OFF</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-2 bg-white rounded-3 border">
              <span className="text-secondary">5 – 9 Residents:</span> <span className="text-success fs-6">20% OFF</span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-2 bg-white rounded-3 border">
              <span className="text-secondary">10+ Residents:</span> <span className="text-danger fs-6">25% MAX BULK OFF</span>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5 text-muted card card-fixmate p-5">
          <div className="spinner-border spinner-border-sm text-primary me-2" role="status"></div> Loading active community groups...
        </div>
      ) : societyGroups.length === 0 ? (
        <div className="text-center py-5 text-muted card card-fixmate p-5">
          <Users size={48} className="text-muted mb-2 mx-auto" />
          <h5 className="fw-bold text-dark mb-1">No Active Society Groups Yet</h5>
          <p className="small text-muted mb-3">Be the first to create a group booking for your residential building or complex!</p>
          <button className="btn btn-fixmate-primary btn-sm rounded-pill px-4 fw-bold mx-auto" onClick={() => setShowCreateModal(true)}>
            Create Society Group
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {societyGroups.map((group) => {
            const isJoined = joinedMap[group.societyBookingId];
            const count = group.membersCount || 1;
            const discount = group.discountPercentage || 15;
            const basePrice = group.service?.price ? Number(group.service.price) : 999;
            const discountedPrice = Math.round(basePrice * (1 - discount / 100));

            return (
              <div className="col-lg-6" key={group.societyBookingId}>
                <div className="card card-fixmate p-4 h-100 border-2 border-primary border-opacity-25">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge bg-primary text-white px-3 py-1.5 rounded-pill fw-bold">
                      <Building size={14} className="me-1 d-inline" /> {group.societyName}
                    </span>
                    <span className="badge bg-success text-white px-3 py-1.5 rounded-pill fw-bold">
                      <Tag size={14} className="me-1 d-inline" /> {discount}% Active Group Discount
                    </span>
                  </div>

                  <h4 className="fw-extrabold text-dark mb-2">{group.service?.serviceName || 'Community Service'}</h4>
                  <p className="text-muted small mb-3">Service Date: <strong>{group.bookingDate}</strong></p>

                  {/* Progress & Count */}
                  <div className="bg-light p-3 rounded-3 mb-4 border">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="small fw-bold text-dark d-flex align-items-center gap-1">
                        <Users size={16} className="text-primary" /> {count} Residents Joined
                      </span>
                      <span className="small text-muted">
                        {count < 5 ? `${5 - count} more for 20% discount` : count < 10 ? `${10 - count} more for 25% max discount` : 'Max 25% Discount Unlocked!'}
                      </span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className={`progress-bar ${count >= 10 ? 'bg-danger' : count >= 5 ? 'bg-success' : 'bg-primary'}`} 
                        role="progressbar" 
                        style={{ width: `${Math.min(100, (count / 15) * 100)}%` }}
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
                      onClick={() => handleJoin(group.societyBookingId)}
                      disabled={isJoined || joiningId === group.societyBookingId}
                    >
                      {joiningId === group.societyBookingId ? (
                        <span><span className="spinner-border spinner-border-sm me-1"></span> Joining...</span>
                      ) : isJoined ? (
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

      {/* Create Society Booking Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4 p-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <Building className="text-primary" /> Start Society Group Booking
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)} disabled={creating}></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-3">
                  Create a society booking pool for your apartment complex and invite neighbors to join for bulk discount rates.
                </p>

                <form onSubmit={handleCreateGroup}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Society / Building Name</label>
                    <input 
                      type="text" 
                      className="form-control py-2" 
                      placeholder="e.g. Green Valley Society, Andheri"
                      value={societyName}
                      onChange={(e) => setSocietyName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Target Service</label>
                    <select 
                      className="form-select py-2" 
                      value={serviceId} 
                      onChange={(e) => setServiceId(e.target.value)}
                      required
                    >
                      {services.map((s) => (
                        <option key={s.serviceId || s.id} value={s.serviceId || s.id}>
                          {s.serviceName} ({s.category}) — Base ₹{s.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold text-secondary">Target Service Date</label>
                    <input 
                      type="date" 
                      className="form-control py-2" 
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                    <button type="button" className="btn btn-light rounded-pill px-3" onClick={() => setShowCreateModal(false)} disabled={creating}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-fixmate-primary rounded-pill px-4 fw-bold" disabled={creating}>
                      {creating ? 'Creating Pool...' : 'Launch Group Booking'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
