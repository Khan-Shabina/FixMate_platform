package com.fixmate.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fixmate.dto.ServiceDTO;
import com.fixmate.service.ServiceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ServiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ServiceService serviceService;

    @Test
    @DisplayName("GET /api/services - Success")
    public void testGetAllServices() throws Exception {
        ServiceDTO s1 = new ServiceDTO(1L, "Electrical Wiring", "Fix electrical wiring", new BigDecimal("499.00"), "Electrician");
        ServiceDTO s2 = new ServiceDTO(2L, "Pipe Leakage Fix", "Fix pipe leakage", new BigDecimal("399.00"), "Plumber");

        Mockito.when(serviceService.getAllServices()).thenReturn(List.of(s1, s2));

        mockMvc.perform(get("/api/services"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].serviceName").value("Electrical Wiring"))
                .andExpect(jsonPath("$[1].category").value("Plumber"));
    }

    @Test
    @DisplayName("GET /api/services/category/{category} - Success")
    public void testGetServicesByCategory() throws Exception {
        ServiceDTO s1 = new ServiceDTO(1L, "Electrical Wiring", "Fix electrical wiring", new BigDecimal("499.00"), "Electrician");

        Mockito.when(serviceService.getServicesByCategory(eq("Electrician"))).thenReturn(List.of(s1));

        mockMvc.perform(get("/api/services/category/Electrician"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].serviceName").value("Electrical Wiring"));
    }

    @Test
    @DisplayName("POST /api/services - Success (201 Created)")
    @WithMockUser(username = "admin@fixmate.com", roles = "ADMIN")
    public void testCreateServiceSuccess() throws Exception {
        ServiceDTO inputDto = new ServiceDTO(null, "New Carpentry Work", "Furniture assembly and repair", new BigDecimal("799.00"), "Carpenter");
        ServiceDTO returnedDto = new ServiceDTO(10L, "New Carpentry Work", "Furniture assembly and repair", new BigDecimal("799.00"), "Carpenter");

        Mockito.when(serviceService.createService(any(ServiceDTO.class))).thenReturn(returnedDto);

        mockMvc.perform(post("/api/services")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.serviceId").value(10))
                .andExpect(jsonPath("$.serviceName").value("New Carpentry Work"))
                .andExpect(jsonPath("$.price").value(799.00));
    }

    @Test
    @DisplayName("POST /api/services - Validation Failure (Blank Name & Negative Price)")
    @WithMockUser(username = "admin@fixmate.com", roles = "ADMIN")
    public void testCreateServiceValidationFailure() throws Exception {
        ServiceDTO invalidDto = new ServiceDTO(null, "", "", new BigDecimal("-50.00"), "");

        mockMvc.perform(post("/api/services")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.errors.serviceName").exists())
                .andExpect(jsonPath("$.errors.price").exists())
                .andExpect(jsonPath("$.errors.category").exists());
    }
}
