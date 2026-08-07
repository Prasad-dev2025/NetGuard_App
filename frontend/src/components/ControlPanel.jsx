import React from 'react';
import { Search, RefreshCw } from 'lucide-react';
import './ControlPanel.css'; // <-- Ensure this import is present

export default function ControlPanel({
  users,
  selectedUser,
  setSelectedUser,
  severity,
  setSeverity,
  onAnalyze,
  loading,
  fetchingUsers
}) {
  return (
    <section className="control-card">
      <h2>Select Target Identity</h2>
      {fetchingUsers ? (
        <div className="loader-inline">
          <RefreshCw className="spin" size={18} /> Loading database entities...
        </div>
      ) : (
        <div className="form-group">
          <label htmlFor="user-select">User Identity:</label>
          <select 
            id="user-select"
            value={selectedUser} 
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="" disabled>Select a target user...</option>
            {users.map((u, index) => {
              const userName = typeof u === 'object' && u !== null ? (u.name || u.username) : u;
              const userKey = typeof u === 'object' && u !== null ? (u.id || u.name || index) : u;

              return (
                <option key={userKey} value={userName}>
                  {userName} {u.role ? `(${u.role})` : ''}
                </option>
              );
            })}
          </select>

          <label htmlFor="severity-select">Vulnerability Severity:</label>
          <select 
            id="severity-select"
            value={severity} 
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
          </select>

          <button 
            className="btn-primary" 
            onClick={onAnalyze} 
            disabled={loading || !selectedUser}
          >
            {loading ? <RefreshCw className="spin" size={18} /> : <Search size={18} />}
            {loading ? "Traversing Graph..." : "Analyze Vulnerability Exposure"}
          </button>
        </div>
      )}
    </section>
  );
}