package com.wexa.graph.repository;

import com.wexa.graph.model.UserNode;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NetworkRepository extends Neo4jRepository<UserNode, String> {
    
}