package com.fixmate.repository;

import com.fixmate.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerUserId(Long customerId);
    List<Booking> findByProviderProviderId(Long providerId);
    List<Booking> findByStatus(String status);
}
