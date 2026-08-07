package com.fixmate.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "provider")
public class Provider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "provider_id")
    private Long providerId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 50)
    private String experience;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(name = "verification_status", length = 20)
    private String verificationStatus = "PENDING"; // PENDING, VERIFIED, REJECTED

    @Column(name = "trust_score")
    private Integer trustScore = 85;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    public Provider() {}

    public Provider(Long providerId, User user, String experience, String location, String verificationStatus, Integer trustScore, Boolean isAvailable) {
        this.providerId = providerId;
        this.user = user;
        this.experience = experience;
        this.location = location;
        this.verificationStatus = verificationStatus;
        this.trustScore = trustScore;
        this.isAvailable = isAvailable;
    }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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
