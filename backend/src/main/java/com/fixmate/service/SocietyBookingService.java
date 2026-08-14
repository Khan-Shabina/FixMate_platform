package com.fixmate.service;

import com.fixmate.entity.SocietyBooking;
import java.util.List;

public interface SocietyBookingService {
    List<SocietyBooking> getAllActiveSocietyBookings();
    List<SocietyBooking> getCustomerSocietyBookings(Long customerId);
    SocietyBooking createSocietyBooking(Long customerId, Long serviceId, String societyName, String bookingDate);
    SocietyBooking joinSocietyBooking(Long societyBookingId, Long customerId);
}
