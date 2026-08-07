package com.fixmate.repository;

import com.fixmate.entity.SocietyBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SocietyBookingRepository extends JpaRepository<SocietyBooking, Long> {
    List<SocietyBooking> findByStatus(String status);
    List<SocietyBooking> findByCustomerUserId(Long customerId);
}
