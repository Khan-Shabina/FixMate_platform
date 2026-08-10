package com.fixmate.controller;

import com.fixmate.dto.ProviderDTO;
import com.fixmate.exception.ResourceNotFoundException;
import com.fixmate.service.ProviderService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProviderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProviderService providerService;

    @Test
    @DisplayName("GET /api/providers - Success (No Password Exposure)")
    public void testGetAllProviders() throws Exception {
        ProviderDTO p1 = new ProviderDTO(1L, 3L, "Rahul Sharma", "rahul.provider@fixmate.com", "+91 9820011223", "8 Years", "Andheri East, Mumbai", "VERIFIED", 97, true);
        ProviderDTO p2 = new ProviderDTO(2L, 4L, "Priya Mehta", "priya.provider@fixmate.com", "+91 9820044556", "5 Years", "Koramangala, Bangalore", "VERIFIED", 95, true);

        Mockito.when(providerService.getAllProviders()).thenReturn(List.of(p1, p2));

        mockMvc.perform(get("/api/providers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].providerId").value(1))
                .andExpect(jsonPath("$[0].name").value("Rahul Sharma"))
                .andExpect(jsonPath("$[0].email").value("rahul.provider@fixmate.com"))
                .andExpect(jsonPath("$[0].verificationStatus").value("VERIFIED"))
                .andExpect(jsonPath("$[0].trustScore").value(97))
                .andExpect(jsonPath("$[0].password").doesNotExist());
    }

    @Test
    @DisplayName("GET /api/providers/{id} - Success")
    public void testGetProviderByIdSuccess() throws Exception {
        ProviderDTO p1 = new ProviderDTO(1L, 3L, "Rahul Sharma", "rahul.provider@fixmate.com", "+91 9820011223", "8 Years", "Andheri East, Mumbai", "VERIFIED", 97, true);

        Mockito.when(providerService.getProviderById(eq(1L))).thenReturn(p1);

        mockMvc.perform(get("/api/providers/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.providerId").value(1))
                .andExpect(jsonPath("$.name").value("Rahul Sharma"))
                .andExpect(jsonPath("$.location").value("Andheri East, Mumbai"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("GET /api/providers/{id} - Not Found (404)")
    public void testGetProviderByIdNotFound() throws Exception {
        Mockito.when(providerService.getProviderById(eq(999L)))
                .thenThrow(new ResourceNotFoundException("Provider", "id", 999L));

        mockMvc.perform(get("/api/providers/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"))
                .andExpect(jsonPath("$.message").value("Provider not found with id : '999'"));
    }

    @Test
    @DisplayName("PUT /api/providers/{id}/availability - Success")
    @WithMockUser(username = "rahul.provider@fixmate.com", roles = "PROVIDER")
    public void testUpdateAvailabilitySuccess() throws Exception {
        ProviderDTO updated = new ProviderDTO(1L, 3L, "Rahul Sharma", "rahul.provider@fixmate.com", "+91 9820011223", "8 Years", "Andheri East, Mumbai", "VERIFIED", 97, false);

        Mockito.when(providerService.updateProviderAvailability(eq(1L), eq(false))).thenReturn(updated);

        mockMvc.perform(put("/api/providers/1/availability?available=false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.providerId").value(1))
                .andExpect(jsonPath("$.isAvailable").value(false))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("PUT /api/providers/{id}/availability - Not Found (404)")
    @WithMockUser(username = "rahul.provider@fixmate.com", roles = "PROVIDER")
    public void testUpdateAvailabilityNotFound() throws Exception {
        Mockito.when(providerService.updateProviderAvailability(eq(999L), eq(false)))
                .thenThrow(new ResourceNotFoundException("Provider", "id", 999L));

        mockMvc.perform(put("/api/providers/999/availability?available=false"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not Found"));
    }
}
