# NetGuard Graph Explorer: Multi-Hop Vulnerability & Attack Path Analysis

A full-stack graph database application built with **Spring Boot**, **React**, and **CognoDB** (Neo4j-compatible graph database layer via the Bolt protocol). Designed to simulate, traverse, and analyze complex network security attack paths.

---

## 1. Use Case Overview
**NetGuard Graph Explorer** addresses a core cybersecurity challenge: identifying how an initial user compromise can pivot across interconnected network devices to reach high-value vulnerabilities (CVEs). 

In modern enterprise networks, threats rarely originate directly at the target asset. Instead, attackers hop through lateral movements across workstations, routers, and internal servers. This application models these infrastructure connections to calculate risk exposure scores and visualize multi-hop attack paths in real-time.

---

## 2. Why a Graph Database?
While relational databases (SQL) excel at structured, tabular rows, they struggle significantly with recursive, deeply nested relationships. 

* **The Relational Problem:** To trace a 3-hop attack path in a relational schema, you must write rigid, deeply nested `JOIN` statements across multiple mapping tables (`users_devices`, `devices_connections`, `devices_vulnerabilities`). If an attacker pivots 4 or 5 hops deep, the query becomes unmaintainable, computationally expensive, and slow.
* **The Graph Advantage:** CognoDB and open Cypher handle connected data natively using index-free adjacency. Finding an attack path requires a simple, readable recursive traversal pattern:
  ```cypher
  MATCH path = (u:User)-[:HAS_ACCESS_TO]->(d:Device)-[:CONNECTS_TO*1..3]->(target:Device)-[:EXPOSES]->(v:Vulnerability)

                             
erDiagram
    USER ||--o{ DEVICE : "HAS_ACCESS_TO"
    DEVICE ||--o{ DEVICE : "CONNECTED_TO (Hop Traversal)"
    DEVICE ||--o{ VULNERABILITY : "HAS_VULNERABILITY"
    DEVICE ||--o{ SUBNET : "BELONGS_TO"

    USER {
        string userName
        string role
        string privilegeLevel
    }

    DEVICE {
        string ipAddress
        string hostname
        string os
        boolean isCompromised
    }

    VULNERABILITY {
        string cveId
        string severity
        float cvssScore
    }

    SUBNET {
        string name
        string cidrBlock
        string zoneType
    }



    ### Graph Data Model Overview

The **NetGuard** application models network connectivity and attack vectors using a graph structure:

* **Nodes:**
  * `User`: Represents users or service accounts accessing the network (`userName`, `role`, `privilegeLevel`).
  * `Device`: Represents network endpoints, servers, or workstations (`ipAddress`, `hostname`, `os`, `isCompromised`).
  * `Vulnerability`: Represents known exploits attached to devices (`cveId`, `severity`, `cvssScore`).
  * `Subnet`: Represents segmented network environments (`name`, `cidrBlock`, `zoneType`).

* **Relationships:**
  * `(:User)-[:HAS_ACCESS_TO]->(:Device)`: Defines initial access permissions.
  * `(:Device)-[:CONNECTED_TO]->(:Device)`: Represents lateral network routing paths (enables multi-hop attack path queries).
  * `(:Device)-[:HAS_VULNERABILITY]->(:Vulnerability)`: Maps security risks directly to target machines.
  * `(:Device)-[:BELONGS_TO]->(:Subnet)`: Groups infrastructure into logical network security zones.