import React from 'react';
import StateBox from './StateBox';
import VisualPathGraph from './VisualPathGraph'; // Swap PathList for VisualPathGraph

export default function ResultsPanel({ 
  error, 
  loading, 
  hasSearched, 
  paths, 
  selectedUser, 
  severity 
}) {
  return (
    <section className="results-card">
      <h2>Analysis Results</h2>

      {error && (
        <StateBox type="error" message={error} />
      )}

      {loading && (
        <StateBox 
          type="loading" 
          message="Performing multi-hop openCypher graph traversal across nodes..." 
        />
      )}

      {!hasSearched && !loading && !error && (
        <StateBox 
          type="initial" 
          message={
            <span>
              Select a user and click <strong>Analyze Vulnerability Exposure</strong> to view topological risk vectors.
            </span>
          } 
        />
      )}

      {hasSearched && !loading && !error && paths.length === 0 && (
        <StateBox 
          type="empty" 
          title="No Attack Vectors Discovered"
          message={`No multi-hop connection paths found linking ${selectedUser} to ${severity} severity risks.`} 
        />
      )}

      {!loading && !error && paths.length > 0 && (
        <VisualPathGraph paths={paths} />
      )}
    </section>
  );
}