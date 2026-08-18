package com.fixmate.service;

import com.fixmate.entity.Booking;
import com.fixmate.entity.Provider;
import com.fixmate.entity.ServiceEntity;
import com.fixmate.entity.SocietyBooking;
import com.fixmate.entity.User;
import com.fixmate.exception.BadRequestException;
import com.fixmate.repository.BookingRepository;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.repository.ServiceRepository;
import com.fixmate.repository.SocietyBookingRepository;
import com.fixmate.repository.UserRepository;
import com.fixmate.service.impl.SocietyBookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SocietyBookingServiceTest {

    @Mock
    private SocietyBookingRepository societyBookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private ProviderRepository providerRepository;

    @InjectMocks
    private SocietyBookingServiceImpl societyBookingService;

    private User customer;
    private ServiceEntity serviceEntity;
    private Provider provider;
    private SocietyBooking groupBooking;

    @BeforeEach
    void setUp() {
        customer = new User();
        customer.setUserId(1L);
        customer.setName("Shabina Khan");
        customer.setEmail("shabina@fixmate.com");

        serviceEntity = new ServiceEntity();
        serviceEntity.setServiceId(5L);
        serviceEntity.setServiceName("Full Pest Control Treatment");
        serviceEntity.setCategory("Pest Control");
        serviceEntity.setPrice(new BigDecimal("1299.00"));

        User providerUser = new User();
        providerUser.setUserId(2L);
        providerUser.setName("Rahul Sharma");

        provider = new Provider();
        provider.setProviderId(10L);
        provider.setUser(providerUser);
        provider.setVerificationStatus("VERIFIED");
        provider.setIsAvailable(true);
        provider.setTrustScore(95);

        groupBooking = SocietyBooking.builder()
                .societyBookingId(100L)
                .customer(customer)
                .service(serviceEntity)
                .societyName("Green Valley Society")
                .membersCount(1)
                .discountPercentage(15)
                .bookingDate(LocalDate.now().plusDays(5))
                .status("ACTIVE")
                .build();
    }

    @Test
    @DisplayName("Create Society Group - Saves group with default 15% discount and 1 member")
    void testCreateSocietyBooking_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(serviceRepository.findById(5L)).thenReturn(Optional.of(serviceEntity));
        when(societyBookingRepository.save(any(SocietyBooking.class))).thenAnswer(inv -> {
            SocietyBooking sb = inv.getArgument(0);
            sb.setSocietyBookingId(200L);
            return sb;
        });

        SocietyBooking created = societyBookingService.createSocietyBooking(1L, 5L, "Sunrise Heights", "2026-08-25");

        assertNotNull(created);
        assertEquals("Sunrise Heights", created.getSocietyName());
        assertEquals(1, created.getMembersCount());
        assertEquals(15, created.getDiscountPercentage());
        assertEquals("ACTIVE", created.getStatus());
    }

    @Test
    @DisplayName("Join Society Group - Increments to 2 members and maintains 15% tier (1-4 members)")
    void testJoinSocietyBooking_Tier15Percent() {
        when(societyBookingRepository.findById(100L)).thenReturn(Optional.of(groupBooking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(providerRepository.findTopByVerificationStatusAndIsAvailableOrderByTrustScoreDesc("VERIFIED", true))
                .thenReturn(Optional.of(provider));
        when(societyBookingRepository.save(any(SocietyBooking.class))).thenAnswer(inv -> inv.getArgument(0));

        SocietyBooking updated = societyBookingService.joinSocietyBooking(100L, 1L);

        assertEquals(2, updated.getMembersCount());
        assertEquals(15, updated.getDiscountPercentage());

        verify(bookingRepository, times(1)).save(argThat(b -> 
            b.getCustomer().equals(customer) &&
            b.getProvider().equals(provider) &&
            b.getService().equals(serviceEntity) &&
            "REQUESTED".equals(b.getStatus())
        ));
    }

    @Test
    @DisplayName("Join Society Group - Upgrades to 20% discount when member count reaches 5 (5-9 members)")
    void testJoinSocietyBooking_Tier20Percent() {
        groupBooking.setMembersCount(4); // will become 5 upon joining
        when(societyBookingRepository.findById(100L)).thenReturn(Optional.of(groupBooking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(providerRepository.findTopByVerificationStatusAndIsAvailableOrderByTrustScoreDesc("VERIFIED", true))
                .thenReturn(Optional.of(provider));
        when(societyBookingRepository.save(any(SocietyBooking.class))).thenAnswer(inv -> inv.getArgument(0));

        SocietyBooking updated = societyBookingService.joinSocietyBooking(100L, 1L);

        assertEquals(5, updated.getMembersCount());
        assertEquals(20, updated.getDiscountPercentage());
    }

    @Test
    @DisplayName("Join Society Group - Upgrades to 25% discount when member count reaches 10+ members")
    void testJoinSocietyBooking_Tier25Percent() {
        groupBooking.setMembersCount(9); // will become 10 upon joining
        when(societyBookingRepository.findById(100L)).thenReturn(Optional.of(groupBooking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(providerRepository.findTopByVerificationStatusAndIsAvailableOrderByTrustScoreDesc("VERIFIED", true))
                .thenReturn(Optional.of(provider));
        when(societyBookingRepository.save(any(SocietyBooking.class))).thenAnswer(inv -> inv.getArgument(0));

        SocietyBooking updated = societyBookingService.joinSocietyBooking(100L, 1L);

        assertEquals(10, updated.getMembersCount());
        assertEquals(25, updated.getDiscountPercentage());
    }

    @Test
    @DisplayName("Join Society Group - Throws BadRequestException when no providers exist")
    void testJoinSocietyBooking_ThrowsWhenNoProvider() {
        when(societyBookingRepository.findById(100L)).thenReturn(Optional.of(groupBooking));
        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(providerRepository.findTopByVerificationStatusAndIsAvailableOrderByTrustScoreDesc("VERIFIED", true))
                .thenReturn(Optional.empty());
        when(providerRepository.findAll()).thenReturn(Collections.emptyList());

        BadRequestException ex = assertThrows(BadRequestException.class, () -> {
            societyBookingService.joinSocietyBooking(100L, 1L);
        });

        assertTrue(ex.getMessage().contains("No service providers are currently available"));
        verify(bookingRepository, never()).save(any());
    }
}
