package com.fixmate.service;

import com.fixmate.dto.ServiceDTO;
import java.util.List;

public interface ServiceService {
    List<ServiceDTO> getAllServices();
    List<ServiceDTO> getServicesByCategory(String category);
    ServiceDTO createService(ServiceDTO serviceDTO);
    ServiceDTO getServiceById(Long serviceId);
}
