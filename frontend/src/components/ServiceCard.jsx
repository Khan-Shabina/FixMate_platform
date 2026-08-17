import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function ServiceCard({ service, onBook }) {
  return (
    <div className="card card-fixmate h-100 p-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div 
          className="rounded-3 p-3 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: service.colorBg || '#EFF6FF', color: service.colorText || '#2563EB', width: '54px', height: '54px' }}
        >
          <i className={`bi bi-${service.icon || 'wrench'} fs-3`}></i>
        </div>
        <span className="badge bg-light text-secondary border px-2 py-1 rounded-pill small">
          {service.count || '150+ providers'}
        </span>
      </div>

      <h5 className="fw-bold text-dark mb-1">{service.name}</h5>
      <p className="text-muted small mb-3 flex-grow-1" style={{ minHeight: '40px' }}>{service.description}</p>

      <div className="d-flex align-items-center justify-content-between pt-2 border-top">
        <div>
          <span className="text-muted small d-block">Starting from</span>
          <span className="fw-extrabold fs-5 text-dark">₹{service.price}</span>
        </div>
        <button 
          className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-1"
          onClick={() => onBook(service)}
        >
          Book Now <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
