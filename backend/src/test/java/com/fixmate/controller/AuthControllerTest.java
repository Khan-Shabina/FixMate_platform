package com.fixmate.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fixmate.dto.AuthDTOs.*;
import com.fixmate.exception.BadRequestException;
import com.fixmate.service.AuthService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    @DisplayName("POST /api/auth/register - Success")
    public void testRegisterSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Sumit Shelar");
        request.setEmail("sumit@fixmate.com");
        request.setPassword("securePassword123");
        request.setPhone("+91 9876543210");
        request.setRole("ROLE_CUSTOMER");

        JwtAuthResponse response = new JwtAuthResponse(
                "jwt.mock.token", "Bearer", 1L, "Sumit Shelar", "sumit@fixmate.com", "ROLE_CUSTOMER"
        );

        Mockito.when(authService.register(any(RegisterRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value("jwt.mock.token"))
                .andExpect(jsonPath("$.email").value("sumit@fixmate.com"))
                .andExpect(jsonPath("$.role").value("ROLE_CUSTOMER"));
    }

    @Test
    @DisplayName("POST /api/auth/register - Validation Failure (Blank Email & Short Password)")
    public void testRegisterValidationFailure() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("S");
        request.setEmail("invalid-email");
        request.setPassword("123");
        request.setPhone("");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }

    @Test
    @DisplayName("POST /api/auth/register - Duplicate Email")
    public void testRegisterDuplicateEmail() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Sumit Shelar");
        request.setEmail("duplicate@fixmate.com");
        request.setPassword("securePassword123");
        request.setPhone("+91 9876543210");

        Mockito.when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new BadRequestException("Email address is already registered!"));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email address is already registered!"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Success")
    public void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("sumit@fixmate.com", "securePassword123");

        JwtAuthResponse response = new JwtAuthResponse(
                "jwt.mock.token", "Bearer", 1L, "Sumit Shelar", "sumit@fixmate.com", "ROLE_CUSTOMER"
        );

        Mockito.when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("jwt.mock.token"))
                .andExpect(jsonPath("$.email").value("sumit@fixmate.com"));
    }

    @Test
    @DisplayName("POST /api/auth/login - Invalid Credentials (401 Unauthorized)")
    public void testLoginBadCredentials() throws Exception {
        LoginRequest request = new LoginRequest("sumit@fixmate.com", "wrongPassword");

        Mockito.when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("POST /api/auth/register - Rejects Admin Registration")
    public void testRegisterRejectAdminRole() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("Hacker Admin");
        request.setEmail("hacker@fixmate.com");
        request.setPassword("securePassword123");
        request.setPhone("+91 9876543210");
        request.setRole("ROLE_ADMIN");

        Mockito.when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new BadRequestException("Public registration as ADMIN is not permitted."));

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Public registration as ADMIN is not permitted."));
    }
}
