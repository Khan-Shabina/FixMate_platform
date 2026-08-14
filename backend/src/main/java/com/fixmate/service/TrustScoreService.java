package com.fixmate.service;

import com.fixmate.entity.Provider;

public interface TrustScoreService {
    Integer calculateAndSetTrustScore(Provider provider);
    Integer updateProviderTrustScore(Long providerId);
}
