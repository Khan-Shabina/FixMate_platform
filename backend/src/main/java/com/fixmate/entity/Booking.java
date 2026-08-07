package com.fixmate.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "provider_id", nullable = false)
    private Provider provider;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate;

    @Column(nullable = false, length = 20)
    private String status = "REQUESTED";

    @Column(name = "emergency_flag")
    private Boolean emergencyFlag = false;

    @Column(nullable = false, length = 255)
    private String address;

    public Booking() {}

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public User getCustomer() { return customer; }
    public void setCustomer(User customer) { this.customer = customer; }

    public Provider getProvider() { return provider; }
    public void setProvider(Provider provider) { this.provider = provider; }

    public ServiceEntity getService() { return service; }
    public void setService(ServiceEntity service) { this.service = service; }

    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getEmergencyFlag() { return emergencyFlag; }
    public void setEmergencyFlag(Boolean emergencyFlag) { this.emergencyFlag = emergencyFlag; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}
