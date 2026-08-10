package com.fixmate.dto;

import com.fixmate.entity.ServiceEntity;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class ServiceDTO {

    private Long serviceId;

    @NotBlank(message = "Service name is required")
    @Size(min = 2, max = 100, message = "Service name must be between 2 and 100 characters")
    private String serviceName;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than zero")
    private BigDecimal price;

    @NotBlank(message = "Category is required")
    @Size(min = 2, max = 50, message = "Category must be between 2 and 50 characters")
    private String category;

    public ServiceDTO() {}

    public ServiceDTO(Long serviceId, String serviceName, String description, BigDecimal price, String category) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.description = description;
        this.price = price;
        this.category = category;
    }

    public static ServiceDTO fromEntity(ServiceEntity service) {
        if (service == null) return null;
        return new ServiceDTO(
                service.getServiceId(),
                service.getServiceName(),
                service.getDescription(),
                service.getPrice(),
                service.getCategory()
        );
    }

    public ServiceEntity toEntity() {
        ServiceEntity entity = new ServiceEntity();
        entity.setServiceId(this.serviceId);
        entity.setServiceName(this.serviceName);
        entity.setDescription(this.description);
        entity.setPrice(this.price);
        entity.setCategory(this.category);
        return entity;
    }

    // Getters and Setters
    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }

    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
