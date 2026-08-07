import React from 'react';
import { AlertTriangle, RefreshCw, Server, CheckCircle } from 'lucide-react';
import './StateBox.css';

export default function StateBox({ type, title, message }) {
  if (type === 'error') {
    return (
      <div className="state-box error-box">
        <AlertTriangle size={24} />
        <div>
          <h4>{title || 'System Alert'}</h4>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  if (type === 'loading') {
    return (
      <div className="state-box loading-box">
        <RefreshCw className="spin" size={28} />
        <p>{message || 'Performing graph traversal across nodes...'}</p>
      </div>
    );
  }

  if (type === 'initial') {
    return (
      <div className="state-box info-box">
        <Server size={28} />
        <p>{message}</p>
      </div>
    );
  }

  if (type === 'empty') {
    return (
      <div className="state-box empty-box">
        <CheckCircle size={28} />
        <div>
          <h4>{title || 'No Vectors Found'}</h4>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return null;
}