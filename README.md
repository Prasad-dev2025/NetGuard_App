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


  ┌────────┐         ┌────────┐         ┌────────┐         ┌───────────────┐
 │  User  │ ──────> │ Device │ ──────> │ Device │ ──────> │ Vulnerability │
 └────────┘         └────────┘         └────────┘         └───────────────┘
          HAS_ACCESS_TO      CONNECTS_TO         EXPOSES
                             
