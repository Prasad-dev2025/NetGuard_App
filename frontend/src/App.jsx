import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ResultsPanel from './components/ResultsPanel';
import { fetchUsersApi, fetchAttackPathsApi } from './api/networkApi';
import './App.css';

export default function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [severity, setSeverity] = useState('CRITICAL');
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setFetchingUsers(true);
    setError(null);
    try {
      const data = await fetchUsersApi();
      setUsers(data);
      if (data.length > 0) setSelectedUser(data[0]);
    } catch (err) {
      setError(err.message || "Failed to load system users.");
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedUser) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await fetchAttackPathsApi(selectedUser, severity);
      setPaths(data);
    } catch (err) {
      setError(err.message || "Failed to query attack paths.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main className="content">
        <ControlPanel 
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          severity={severity}
          setSeverity={setSeverity}
          onAnalyze={handleAnalyze}
          loading={loading}
          fetchingUsers={fetchingUsers}
        />
        <ResultsPanel 
          error={error}
          loading={loading}
          hasSearched={hasSearched}
          paths={paths}
          selectedUser={selectedUser}
          severity={severity}
        />
      </main>
    </div>
  );
}