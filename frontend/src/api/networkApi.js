const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const API_BASE = `${API_BASE_URL}/api/network`;

export const fetchUsersApi = async () => {
  const response = await fetch(`${API_BASE}/users`);
  if (!response.ok) {
    throw new Error("Could not connect to backend server.");
  }
  return response.json();
};

export const fetchAttackPathsApi = async (userName, severity) => {
  const url = `${API_BASE}/attack-paths?userName=${encodeURIComponent(userName)}&severity=${encodeURIComponent(severity)}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to query attack paths.");
  }
  
  return response.json();
};