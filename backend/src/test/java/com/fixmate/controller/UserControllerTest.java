package com.fixmate.controller;

import com.fixmate.dto.UserDTO;
import com.fixmate.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    @DisplayName("GET /api/users/me - Authenticated Success (No Password Exposure)")
    @WithMockUser(username = "sumit@fixmate.com", roles = "CUSTOMER")
    public void testGetCurrentUserSuccess() throws Exception {
        UserDTO dto = new UserDTO(1L, "Sumit Shelar", "sumit@fixmate.com", "+91 9876543210", "ROLE_CUSTOMER", LocalDateTime.now());

        Mockito.when(userService.getCurrentUser(anyString())).thenReturn(dto);

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.name").value("Sumit Shelar"))
                .andExpect(jsonPath("$.email").value("sumit@fixmate.com"))
                .andExpect(jsonPath("$.role").value("ROLE_CUSTOMER"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("GET /api/users/me - Unauthenticated (401 Unauthorized)")
    public void testGetCurrentUserUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/users - Customer Role (403 Forbidden)")
    @WithMockUser(username = "customer@fixmate.com", roles = "CUSTOMER")
    public void testGetAllUsersForbidden() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/users - Admin Role (200 OK)")
    @WithMockUser(username = "admin@fixmate.com", roles = "ADMIN")
    public void testGetAllUsersAdminSuccess() throws Exception {
        UserDTO dto1 = new UserDTO(1L, "Sumit Shelar", "sumit@fixmate.com", "+91 9876543210", "ROLE_CUSTOMER", LocalDateTime.now());
        UserDTO dto2 = new UserDTO(2L, "Admin User", "admin@fixmate.com", "+91 9999999999", "ROLE_ADMIN", LocalDateTime.now());

        Mockito.when(userService.getAllUsers()).thenReturn(List.of(dto1, dto2));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
}
