package com.fixmate.controller;

import com.fixmate.entity.Booking;
import com.fixmate.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getCustomerBookings(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingRepository.findByCustomerUserId(customerId));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Booking>> getProviderBookings(@PathVariable Long providerId) {
        return ResponseEntity.ok(bookingRepository.findByProviderProviderId(providerId));
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        if (booking.getStatus() == null) {
            booking.setStatus("REQUESTED");
        }
        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            Booking b = bookingOpt.get();
            b.setStatus(status);
            bookingRepository.save(b);
            return ResponseEntity.ok(b);
        }
        return ResponseEntity.notFound().build();
    }
}
