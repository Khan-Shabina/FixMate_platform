package com.fixmate.dto;

import com.fixmate.entity.Provider;

public class ProviderDTO {

    private Long providerId;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String experience;
    private String location;
    private String verificationStatus;
    private Integer trustScore;
    private Boolean isAvailable;

    public ProviderDTO() {}

    public ProviderDTO(Long providerId, Long userId, String name, String email, String phone,
                       String experience, String location, String verificationStatus,
                       Integer trustScore, Boolean isAvailable) {
        this.providerId = providerId;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.experience = experience;
        this.location = location;
        this.verificationStatus = verificationStatus;
        this.trustScore = trustScore;
        this.isAvailable = isAvailable;
    }

    public static ProviderDTO fromEntity(Provider provider) {
        if (provider == null) return null;
        Long userId = provider.getUser() != null ? provider.getUser().getUserId() : null;
        String name = provider.getUser() != null ? provider.getUser().getName() : null;
        String email = provider.getUser() != null ? provider.getUser().getEmail() : null;
        String phone = provider.getUser() != null ? provider.getUser().getPhone() : null;

        return new ProviderDTO(
                provider.getProviderId(),
                userId,
                name,
                email,
                phone,
                provider.getExperience(),
                provider.getLocation(),
                provider.getVerificationStatus(),
                provider.getTrustScore(),
                provider.getIsAvailable()
        );
    }

    // Getters and Setters
    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
