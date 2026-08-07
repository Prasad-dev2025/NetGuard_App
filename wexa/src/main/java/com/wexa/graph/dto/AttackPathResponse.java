package com.wexa.graph.dto;

import java.util.List;

public class AttackPathResponse {
    private String pathId;
    private List<String> nodes;
    private String formattedPath;
    private String severity;
    private double riskScore;
    private boolean hasCrownJewelTarget;
    private boolean isChokePointPath;

    public AttackPathResponse(String pathId, List<String> nodes, String formattedPath, String severity, double riskScore, boolean hasCrownJewelTarget, boolean isChokePointPath) {
        this.pathId = pathId;
        this.nodes = nodes;
        this.formattedPath = formattedPath;
        this.severity = severity;
        this.riskScore = riskScore;
        this.hasCrownJewelTarget = hasCrownJewelTarget;
        this.isChokePointPath = isChokePointPath;
    }

    // Getters
    public String getPathId() { return pathId; }
    public List<String> getNodes() { return nodes; }
    public String getFormattedPath() { return formattedPath; }
    public String getSeverity() { return severity; }
    public double getRiskScore() { return riskScore; }
    public boolean isHasCrownJewelTarget() { return hasCrownJewelTarget; }
    public boolean isIsChokePointPath() { return isChokePointPath; }
}