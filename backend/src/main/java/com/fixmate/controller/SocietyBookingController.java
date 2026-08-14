package com.fixmate.controller;

import com.fixmate.entity.SocietyBooking;
import com.fixmate.service.SocietyBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/society-bookings")
@CrossOrigin(origins = "*")
public class SocietyBookingController {

    @Autowired
    private SocietyBookingService societyBookingService;

    @GetMapping
    public ResponseEntity<List<SocietyBooking>> getAllActiveSocietyBookings() {
        return ResponseEntity.ok(societyBookingService.getAllActiveSocietyBookings());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<SocietyBooking>> getCustomerSocietyBookings(@PathVariable Long customerId) {
        return ResponseEntity.ok(societyBookingService.getCustomerSocietyBookings(customerId));
    }

    @PostMapping
    public ResponseEntity<SocietyBooking> createSocietyBooking(
            @RequestParam Long customerId,
            @RequestParam Long serviceId,
            @RequestParam(required = false) String societyName,
            @RequestParam(required = false) String bookingDate) {
        SocietyBooking created = societyBookingService.createSocietyBooking(customerId, serviceId, societyName, bookingDate);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<SocietyBooking> joinSocietyBooking(
            @PathVariable Long id,
            @RequestParam Long customerId) {
        SocietyBooking updated = societyBookingService.joinSocietyBooking(id, customerId);
        return ResponseEntity.ok(updated);
    }
}
