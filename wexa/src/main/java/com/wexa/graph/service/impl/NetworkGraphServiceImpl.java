package com.wexa.graph.service.impl;

import com.wexa.graph.dto.AttackPathResponse;
import com.wexa.graph.dto.UserResponse;
import com.wexa.graph.model.UserNode;
import com.wexa.graph.repository.NetworkRepository;
import com.wexa.graph.service.NetworkGraphService;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true, transactionManager = "transactionManager")
public class NetworkGraphServiceImpl implements NetworkGraphService {

    private final NetworkRepository networkRepository;
    private final Neo4jClient neo4jClient;

    public NetworkGraphServiceImpl(NetworkRepository networkRepository, Neo4jClient neo4jClient) {
        this.networkRepository = networkRepository;
        this.neo4jClient = neo4jClient;
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<UserNode> users = networkRepository.findAll();
        
        if (users == null || users.isEmpty()) {
            return Collections.emptyList();
        }

        return users.stream()
                .map(u -> new UserResponse(u.getName(), u.getRole()))
                .collect(Collectors.toList());
    }

    @Override
    public List<AttackPathResponse> getAttackPathsForUser(String userName, String severity) {
        // Safe string concatenation for Java version compatibility
        String query = "MATCH path = (u:User {name: $userName})-[:HAS_ACCESS_TO]->(d:Device)-[:CONNECTS_TO*0..3]->(target:Device)-[:EXPOSES]->(v:Vulnerability {severity: $severity}) " +
                       "RETURN [node IN nodes(path) | COALESCE(node.name, node.hostname, node.cve)] AS nodeNames";

        Collection<Map<String, Object>> results = neo4jClient.query(query)
                .bind(userName).to("userName")
                .bind(severity).to("severity")
                .fetch()
                .all();

        if (results == null || results.isEmpty()) {
            return Collections.emptyList();
        }

        List<AttackPathResponse> responses = new ArrayList<>();
        int pathCounter = 1;

        for (Map<String, Object> row : results) {
            @SuppressWarnings("unchecked")
            List<String> nodes = (List<String>) row.get("nodeNames");
            
            if (nodes != null && !nodes.isEmpty()) {
                String formattedPath = String.join(" ➔ ", nodes);
                String pathId = "PATH-" + pathCounter++;
                
                double baseWeight = severity.equalsIgnoreCase("CRITICAL") ? 9.0 : 6.0;
                double hopPenalty = nodes.size() * 0.5;
                double riskScore = Math.min(10.0, baseWeight + hopPenalty);
                riskScore = Math.round(riskScore * 10.0) / 10.0;

                boolean crownJewel = nodes.stream().anyMatch(n -> 
                    n.toLowerCase().contains("db") || 
                    n.toLowerCase().contains("payment") || 
                    n.toLowerCase().contains("ledger")
                );

                boolean chokePoint = nodes.size() <= 3;

                responses.add(new AttackPathResponse(pathId, nodes, formattedPath, severity, riskScore, crownJewel, chokePoint));
            }
        }

        return responses;
    }

    @Override
    public String generateRemediationPlaybook(String targetNode, String severity) {
        if (severity != null && severity.equalsIgnoreCase("CRITICAL")) {
            return """
                ---
                - name: Emergency Critical Asset Remediation Playbook
                  hosts: %s
                  become: yes
                  tasks:
                    - name: Isolate compromised interface
                      ansible.builtin.iptables:
                        chain: INPUT
                        protocol: tcp
                        jump: DROP
                    - name: Apply emergency kernel security patch
                      ansible.builtin.apt:
                        name: "*"
                        state: latest
                        update_cache: yes
                """.formatted(targetNode);
        } else {
            return """
                #!/bin/bash
                # Automated Remediation Script for Target: %s
                echo "[+] Scanning service bindings..."
                sudo systemctl stop vulnerable-service
                echo "[+] Applying security hardening rules..."
                sudo ufw deny proto tcp from any to any port 443
                echo "[+] Remediation applied successfully."
                """.formatted(targetNode);
        }
    }
}