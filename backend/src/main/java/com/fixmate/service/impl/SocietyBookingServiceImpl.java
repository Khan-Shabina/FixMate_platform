package com.fixmate.service.impl;

import com.fixmate.entity.Booking;
import com.fixmate.entity.ServiceEntity;
import com.fixmate.entity.SocietyBooking;
import com.fixmate.entity.User;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.ServiceRepository;
import com.fixmate.repository.SocietyBookingRepository;
import com.fixmate.repository.UserRepository;
import com.fixmate.service.SocietyBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SocietyBookingServiceImpl implements SocietyBookingService {

    @Autowired
    private SocietyBookingRepository societyBookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SocietyBooking> getAllActiveSocietyBookings() {
        return societyBookingRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SocietyBooking> getCustomerSocietyBookings(Long customerId) {
        return societyBookingRepository.findByCustomerUserId(customerId);
    }

    @Override
    @Transactional
    public SocietyBooking createSocietyBooking(Long customerId, Long serviceId, String societyName, String bookingDateStr) {
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        ServiceEntity service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", serviceId));

        LocalDate bDate = (bookingDateStr != null && !bookingDateStr.trim().isEmpty()) 
                ? LocalDate.parse(bookingDateStr) 
                : LocalDate.now().plusDays(7);

        SocietyBooking groupBooking = SocietyBooking.builder()
                .customer(customer)
                .service(service)
                .societyName(societyName != null ? societyName : "Green Valley Society")
                .membersCount(1)
                .discountPercentage(15)
                .bookingDate(bDate)
                .status("ACTIVE")
                .build();

        return societyBookingRepository.save(groupBooking);
    }

    @Override
    @Transactional
    public SocietyBooking joinSocietyBooking(Long societyBookingId, Long customerId) {
        SocietyBooking groupBooking = societyBookingRepository.findById(societyBookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Society Booking Group", "id", societyBookingId));

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", customerId));

        int newCount = groupBooking.getMembersCount() + 1;
        groupBooking.setMembersCount(newCount);

        // Calculate dynamic group discount percentage
        int discount = 15;
        if (newCount >= 10) {
            discount = 25;
        } else if (newCount >= 5) {
            discount = 20;
        }
        groupBooking.setDiscountPercentage(discount);

        SocietyBooking savedGroup = societyBookingRepository.save(groupBooking);

        // Auto-create a discounted individual booking for the joined resident
        Booking individualBooking = new Booking();
        individualBooking.setCustomer(customer);
        individualBooking.setService(groupBooking.getService());
        individualBooking.setBookingDate(groupBooking.getBookingDate().atTime(10, 0));
        individualBooking.setAddress(groupBooking.getSocietyName());
        individualBooking.setStatus("REQUESTED");
        individualBooking.setEmergencyFlag(false);
        bookingRepository.save(individualBooking);

        return savedGroup;
    }
}
