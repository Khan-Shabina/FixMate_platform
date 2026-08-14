package com.fixmate.controller;

import com.fixmate.dto.BookingDTOs.BookingRequestDTO;
import com.fixmate.dto.BookingDTOs.BookingResponseDTO;
import com.fixmate.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponseDTO>> getCustomerBookings(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getCustomerBookings(customerId));
    }

    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<BookingResponseDTO>> getProviderBookings(@PathVariable Long providerId) {
        return ResponseEntity.ok(bookingService.getProviderBookings(providerId));
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@Valid @RequestBody BookingRequestDTO requestDTO) {
        BookingResponseDTO response = bookingService.createBooking(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponseDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        BookingResponseDTO updated = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}
