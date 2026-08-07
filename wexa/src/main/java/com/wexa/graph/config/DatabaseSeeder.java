package com.wexa.graph.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);
    private final Neo4jClient neo4jClient;

    public DatabaseSeeder(Neo4jClient neo4jClient) {
        this.neo4jClient = neo4jClient;
    }

    @Override
    public void run(String... args) {
        log.info("Initializing CognoDB graph dataset...");

        try {
            // Step 1: Clear existing database nodes
            neo4jClient.query("MATCH (n) DETACH DELETE n;").run();

            // Step 2: Seed Graph Entities & Multi-Hop Traversal Relationships
            neo4jClient.query("""
                // Create User Nodes
                CREATE (u1:User {name: 'Admin_Alice', role: 'Security Admin'})
                CREATE (u2:User {name: 'Dev_Bob', role: 'Backend Engineer'})
                CREATE (u3:User {name: 'Auditor_Charlie', role: 'External Auditor'})

                // Create Device Nodes
                CREATE (d1:Device {hostname: 'Bastion-Host', ip: '10.0.0.1'})
                CREATE (d2:Device {hostname: 'Internal-Wiki', ip: '10.0.1.15'})
                CREATE (d3:Device {hostname: 'Prod-DB-Cluster', ip: '10.0.2.100'})
                CREATE (d4:Device {hostname: 'Payment-Gateway', ip: '10.0.3.50'})

                // Create Vulnerability Nodes
                CREATE (v1:Vulnerability {cve: 'CVE-2024-21626', severity: 'CRITICAL', description: 'Container Escape Vulnerability'})
                CREATE (v2:Vulnerability {cve: 'CVE-2023-38606', severity: 'HIGH', description: 'Kernel Privilege Escalation'})

                // Create Access Relationships (Hop 1)
                CREATE (u1)-[:HAS_ACCESS_TO {privilege: 'SSH_ROOT'}]->(d1)
                CREATE (u2)-[:HAS_ACCESS_TO {privilege: 'HTTP_READ'}]->(d2)
                CREATE (u3)-[:HAS_ACCESS_TO {privilege: 'GUEST'}]->(d2)

                // Create Inter-Device Network Traversal Connections (Hop 2)
                CREATE (d1)-[:CONNECTS_TO {port: 22}]->(d3)
                CREATE (d2)-[:CONNECTS_TO {port: 5432}]->(d3)
                CREATE (d3)-[:CONNECTS_TO {port: 443}]->(d4)

                // Create Exposed Vulnerability Relationships (Hop 3)
                CREATE (d3)-[:EXPOSES]->(v1)
                CREATE (d2)-[:EXPOSES]->(v2)
                CREATE (d4)-[:EXPOSES]->(v1)
            """).run();

            log.info("CognoDB successfully seeded with multi-hop security graph dataset.");

        } catch (Exception ex) {
            log.error("Failed to seed CognoDB database: {}", ex.getMessage());
        }
    }
}