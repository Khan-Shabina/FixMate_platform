package com.fixmate.service;

import com.fixmate.dto.ProviderDTO;
import java.util.List;

public interface ProviderService {
    List<ProviderDTO> getAllProviders();
    ProviderDTO getProviderById(Long id);
    ProviderDTO getProviderByUserId(Long userId);
    ProviderDTO updateProviderAvailability(Long id, Boolean available);
    List<ProviderDTO> getVerifiedAvailableProviders();
}
