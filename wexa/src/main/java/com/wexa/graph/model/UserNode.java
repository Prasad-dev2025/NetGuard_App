package com.wexa.graph.model;

import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

@Node("User")
public class UserNode {

    @Id
    private String name;
    private String role;

    public UserNode() {}

    public UserNode(String name, String role) {
        this.name = name;
        this.role = role;
    }

    // Explicit Getters (Required by NetworkGraphServiceImpl)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}