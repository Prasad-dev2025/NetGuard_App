package com.wexa.graph;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;

@SpringBootApplication
@EnableNeo4jRepositories(basePackages = "com.wexa.graph.repository")
public class WexaApplication {

    public static void main(String[] args) {
        SpringApplication.run(WexaApplication.class, args);
    }
}