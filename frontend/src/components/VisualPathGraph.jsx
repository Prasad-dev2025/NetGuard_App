import React, { useState, useEffect } from 'react';
import { 
  Server, 
  ShieldAlert, 
  UserCheck, 
  ArrowRight, 
  Crown, 
  Flame, 
  Activity, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Layers,
  Crosshair,
  Terminal,
  FileText,
  Info,
  X,
  Copy,
  Check
} from 'lucide-react';
import './VisualPathGraph.css';

export default function VisualPathGraph({ paths = [], selectedUser, severity }) {
  const [patchedNodes, setPatchedNodes] = useState(new Set());
  const [selectedCve, setSelectedCve] = useState(null);
  const [playbookData, setPlaybookData] = useState(null);
  const [copied, setCopied] = useState(false);

  // Sync browser back/forward button with modals
  useEffect(() => {
    const handlePopState = () => {
      if (selectedCve) setSelectedCve(null);
      if (playbookData) setPlaybookData(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedCve, playbookData]);

  const openCveModal = (cveData) => {
    window.history.pushState({ modal: 'cve' }, '');
    setSelectedCve(cveData);
  };

  const closeCveModal = () => {
    if (selectedCve) {
      window.history.back();
    }
  };

  const openPlaybookModal = (scriptData) => {
    window.history.pushState({ modal: 'playbook' }, '');
    setPlaybookData(scriptData);
  };

  const closePlaybookModal = () => {
    if (playbookData) {
      window.history.back();
    }
  };

  if (!paths || paths.length === 0) return null;

  const togglePatchNode = (nodeName) => {
    const updated = new Set(patchedNodes);
    if (updated.has(nodeName)) {
      updated.delete(nodeName);
    } else {
      updated.add(nodeName);
    }
    setPatchedNodes(updated);
  };

  const activePaths = paths.filter(p => !p.nodes.some(node => patchedNodes.has(node)));
  const mitigatedCount = paths.length - activePaths.length;

  const handleNodeClick = (nodeName, index, totalNodes) => {
    if (index === totalNodes - 1) {
      openCveModal({
        cveId: nodeName,
        cvss: severity === 'CRITICAL' ? '9.8 Critical' : '7.5 High',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        description: `Exploitable vulnerability detected on boundary target. Permits remote code execution via unauthenticated handshake packets.`
      });
    }
  };

  const generatePlaybook = (targetNode) => {
    const script = severity.equalsIgnoreCase?.('CRITICAL') || severity === 'CRITICAL' 
      ? `---
- name: Emergency Critical Asset Remediation
  hosts: ${targetNode}
  become: yes
  tasks:
    - name: Isolate compromised interface
      ansible.builtin.iptables:
        chain: INPUT
        jump: DROP
    - name: Patch vulnerability package
      ansible.builtin.apt:
        name: secure-daemon
        state: latest`
      : `#!/bin/bash
# Remediation Script for ${targetNode}
sudo systemctl stop vulnerable-service
sudo ufw deny proto tcp from any to any
echo "Remediation applied."`;

    openPlaybookModal({ target: targetNode, script });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAuditReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      user: selectedUser,
      targetSeverity: severity,
      activeVectorsCount: activePaths.length,
      mitigatedVectorsCount: mitigatedCount,
      paths: activePaths
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NetGuard-Audit-Report-${selectedUser || 'Export'}.json`;
    a.click();
  };

  return (
    <div className="visual-path-container">
      {/* Telemetry & Audit Bar */}
      <div className="telemetry-bar">
        <div className="telemetry-cluster-left">
          <div className="telemetry-item">
            <Activity size={16} className="telemetry-icon" />
            <span>Active Vectors: <strong>{activePaths.length} / {paths.length}</strong></span>
          </div>
          {mitigatedCount > 0 && (
            <div className="telemetry-item mitigated">
              <ShieldCheck size={16} className="telemetry-icon success" />
              <span>Mitigated: <strong>{mitigatedCount}</strong></span>
            </div>
          )}
        </div>

        <div className="telemetry-cluster-right">
          <button className="audit-export-btn" onClick={exportAuditReport}>
            <FileText size={14} /> Export Audit Report
          </button>
          {patchedNodes.size > 0 && (
            <button className="reset-patch-btn" onClick={() => setPatchedNodes(new Set())}>
              Reset Simulation
            </button>
          )}
        </div>
      </div>

      <h3>
        <Crosshair size={18} /> Discovered Attack Trajectories & Remediation Suite
      </h3>

      {activePaths.map((p, idx) => (
        <div key={p.pathId || idx} className={`visual-path-card ${p.isHasCrownJewelTarget ? 'crown-jewel-glow' : ''}`}>
          <div className="path-meta-header">
            <div className="badge-group">
              <span className="badge"><Layers size={12} /> {p.pathId}</span>
              {p.isHasCrownJewelTarget && (
                <span className="crown-badge"><Crown size={12} /> Crown Jewel</span>
              )}
              {p.isIsChokePointPath && (
                <span className="choke-badge"><Flame size={12} /> Choke Point</span>
              )}
            </div>

            <div className="path-action-cluster">
              <button 
                className="playbook-trigger-btn"
                onClick={() => generatePlaybook(p.nodes[p.nodes.length - 1])}
              >
                <Terminal size={12} /> Generate Playbook
              </button>
              <div className="score-badge">
                <Zap size={12} className="risk-icon" />
                Risk: <strong>{p.riskScore}</strong>
              </div>
            </div>
          </div>

          {/* Node Flow Chain */}
          <div className="node-flow-chain">
            {p.nodes.map((nodeName, nodeIdx) => {
              const isPatched = patchedNodes.has(nodeName);
              const isVuln = nodeIdx === p.nodes.length - 1;
              return (
                <React.Fragment key={nodeIdx}>
                  <div 
                    className={`node-chip ${isPatched ? 'patched' : ''} ${isVuln ? 'vuln-node' : ''}`}
                    onClick={() => isVuln && handleNodeClick(nodeName, nodeIdx, p.nodes.length)}
                    title={isVuln ? "Click for CVE Intelligence" : ""}
                  >
                    {nodeIdx === 0 ? <UserCheck size={16} className="node-icon user" /> :
                     isVuln ? <ShieldAlert size={16} className="node-icon vuln" /> :
                     <Server size={16} className="node-icon device" />}
                    
                    <span className="node-name">{nodeName}</span>
                    
                    {nodeIdx > 0 && nodeIdx < p.nodes.length - 1 && (
                      <button 
                        className={`patch-toggle-btn ${isPatched ? 'undo' : ''}`}
                        onClick={(e) => { e.stopPropagation(); togglePatchNode(nodeName); }}
                      >
                        {isPatched ? "Restored" : "Patch"}
                      </button>
                    )}
                  </div>
                  {nodeIdx < p.nodes.length - 1 && (
                    <div className="flow-connector"><ArrowRight size={14} /></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      ))}

      {/* CVE Intelligence Modal */}
      {selectedCve && (
        <div className="modal-backdrop" onClick={closeCveModal}>
          <div className="cve-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4><Info size={18} /> CVE Intelligence: {selectedCve.cveId}</h4>
              <button className="close-btn" onClick={closeCveModal}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <p><strong>Severity Score:</strong> <span className="crit-text">{selectedCve.cvss}</span></p>
              <p><strong>Vector String:</strong> <code>{selectedCve.vector}</code></p>
              <p><strong>Threat Analysis:</strong> {selectedCve.description}</p>
            </div>
          </div>
        </div>
      )}

      {/* Automated Remediation Playbook Modal */}
      {playbookData && (
        <div className="modal-backdrop" onClick={closePlaybookModal}>
          <div className="cve-modal playbook-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4><Terminal size={18} /> Automated Remediation Script ({playbookData.target})</h4>
              <button className="close-btn" onClick={closePlaybookModal}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <pre className="code-block"><code>{playbookData.script}</code></pre>
              <button className="copy-script-btn" onClick={() => copyToClipboard(playbookData.script)}>
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copied to Clipboard" : "Copy Playbook"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}