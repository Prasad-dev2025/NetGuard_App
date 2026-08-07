package com.wexa.graph.service;

import com.wexa.graph.dto.AttackPathResponse;
import com.wexa.graph.dto.UserResponse;
import java.util.List;

public interface NetworkGraphService {
    List<UserResponse> getAllUsers();
    List<AttackPathResponse> getAttackPathsForUser(String userName, String severity);
    String generateRemediationPlaybook(String targetNode, String severity);
}