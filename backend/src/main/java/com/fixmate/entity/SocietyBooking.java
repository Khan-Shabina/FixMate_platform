package com.fixmate.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "society_booking")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocietyBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "society_booking_id")
    private Long societyBookingId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceEntity service;

    @Builder.Default
    @Column(name = "members_count")
    private Integer membersCount = 1;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Builder.Default
    @Column(length = 20)
    private String status = "ACTIVE"; // ACTIVE, CONFIRMED, COMPLETED

    @Column(name = "society_name", nullable = false, length = 100)
    private String societyName;

    @Builder.Default
    @Column(name = "discount_percentage")
    private Integer discountPercentage = 15;
}
