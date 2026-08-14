package com.fixmate.service;

import com.fixmate.dto.BookingDTOs.BookingRequestDTO;
import com.fixmate.dto.BookingDTOs.BookingResponseDTO;
import java.util.List;

public interface BookingService {
    List<BookingResponseDTO> getAllBookings();
    List<BookingResponseDTO> getCustomerBookings(Long customerId);
    List<BookingResponseDTO> getProviderBookings(Long providerId);
    BookingResponseDTO getBookingById(Long bookingId);
    BookingResponseDTO createBooking(BookingRequestDTO requestDTO);
    BookingResponseDTO updateBookingStatus(Long bookingId, String status);
}
