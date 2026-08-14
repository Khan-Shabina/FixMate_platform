package com.fixmate.repository;

import com.fixmate.entity.Provider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByUser_UserId(Long userId);
    List<Provider> findByVerificationStatus(String verificationStatus);
    List<Provider> findByIsAvailable(Boolean isAvailable);

    // Auto-dispatch highest trust score verified available provider for Emergency bookings
    Optional<Provider> findTopByVerificationStatusAndIsAvailableOrderByTrustScoreDesc(String verificationStatus, Boolean isAvailable);
}