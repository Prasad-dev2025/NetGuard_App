package com.wexa.graph.controller;

import com.wexa.graph.dto.AttackPathResponse;
import com.wexa.graph.dto.UserResponse;
import com.wexa.graph.service.NetworkGraphService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/network")
public class NetworkGraphController {

    private final NetworkGraphService networkGraphService;

    public NetworkGraphController(NetworkGraphService networkGraphService) {
        this.networkGraphService = networkGraphService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(networkGraphService.getAllUsers());
    }

    @GetMapping("/attack-paths")
    public ResponseEntity<List<AttackPathResponse>> getAttackPaths(
            @RequestParam String userName,
            @RequestParam String severity) {
        return ResponseEntity.ok(networkGraphService.getAttackPathsForUser(userName, severity));
    }
}