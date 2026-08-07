import React from 'react';
import './PathList.css';

export default function PathList({ paths = [] }) {
  if (!paths || paths.length === 0) {
    return null;
  }

  return (
    <div className="path-results">
      <h3>Discovered Attack Trajectories ({paths.length})</h3>
      <ul className="path-list">
        {paths.map((p, idx) => (
          <li key={p.pathId || idx} className="path-card">
            <div className="path-header">
              <span className="badge">{p.pathId || `Path #${idx + 1}`}</span>
              <span className="severity-tag">{p.severity}</span>
            </div>
            <p>{p.formattedPath}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}