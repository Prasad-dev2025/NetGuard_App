import React from 'react';
import { ShieldAlert } from 'lucide-react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="logo-section">
        <ShieldAlert className="logo-icon" size={32} />
        <div>
          <h1>NetGuard Graph Explorer</h1>
          <p>Multi-Hop Cyber Attack Path & Exposure Analysis</p>
        </div>
      </div>
    </header>
  );
}