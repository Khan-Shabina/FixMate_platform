package com.fixmate.service.impl;

import com.fixmate.dto.ProviderDTO;
import com.fixmate.entity.Provider;
import com.fixmate.exception.BadRequestException;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.ProviderRepository;
import com.fixmate.service.ProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProviderServiceImpl implements ProviderService {

    @Autowired
    private ProviderRepository providerRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProviderDTO> getAllProviders() {
        return providerRepository.findAll().stream()
                .map(ProviderDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProviderDTO getProviderById(Long id) {
        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", id));
        return ProviderDTO.fromEntity(provider);
    }

    @Override
    @Transactional
    public ProviderDTO updateProviderAvailability(Long id, Boolean available) {
        if (available == null) {
            throw new BadRequestException("Query parameter 'available' must be provided (true/false)");
        }

        Provider provider = providerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", id));

        provider.setIsAvailable(available);
        Provider updatedProvider = providerRepository.save(provider);
        return ProviderDTO.fromEntity(updatedProvider);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProviderDTO> getVerifiedAvailableProviders() {
        return providerRepository.findAll().stream()
                .filter(p -> "VERIFIED".equalsIgnoreCase(p.getVerificationStatus()) && Boolean.TRUE.equals(p.getIsAvailable()))
                .map(ProviderDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
