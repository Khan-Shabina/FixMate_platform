package com.fixmate.service.impl;

import com.fixmate.dto.ServiceDTO;
import com.fixmate.entity.ServiceEntity;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.repository.ServiceRepository;
import com.fixmate.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceServiceImpl implements ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ServiceDTO> getAllServices() {
        return serviceRepository.findAll().stream()
                .map(ServiceDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceDTO> getServicesByCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            return getAllServices();
        }
        return serviceRepository.findByCategory(category).stream()
                .map(ServiceDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ServiceDTO createService(ServiceDTO serviceDTO) {
        ServiceEntity entity = serviceDTO.toEntity();
        ServiceEntity savedEntity = serviceRepository.save(entity);
        return ServiceDTO.fromEntity(savedEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceDTO getServiceById(Long serviceId) {
        ServiceEntity entity = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", serviceId));
        return ServiceDTO.fromEntity(entity);
    }
}
