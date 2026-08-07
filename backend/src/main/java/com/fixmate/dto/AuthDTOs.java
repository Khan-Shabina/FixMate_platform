package com.fixmate.dto;

public class AuthDTOs {

    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String phone;
        private String role;
        private String experience;
        private String location;

        public RegisterRequest() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getExperience() { return experience; }
        public void setExperience(String experience) { this.experience = experience; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
    }

    public static class JwtAuthResponse {
        private String accessToken;
        private String tokenType = "Bearer";
        private Long userId;
        private String name;
        private String email;
        private String role;

        public JwtAuthResponse(String accessToken, String tokenType, Long userId, String name, String email, String role) {
            this.accessToken = accessToken;
            this.tokenType = tokenType;
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public String getAccessToken() { return accessToken; }
        public String getTokenType() { return tokenType; }
        public Long getUserId() { return userId; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
    }
}
