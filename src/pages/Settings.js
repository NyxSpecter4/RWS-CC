import React from 'react';
import './../App.css';

const Settings = () => {
  return (
    <div className="page-container">
      <header className="dashboard-header">
        <h2>Settings</h2>
        <p>Configure property details, users, and notifications here.</p>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Property Details</h3>
            <span className="card-badge">Edit</span>
          </div>
          <div className="card-content">
            <p>Update address, square footage, year built, and other core property information.</p>
            <button className="btn-primary">Edit</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>User Management</h3>
            <span className="card-badge">3 Admins</span>
          </div>
          <div className="card-content">
            <p>Add or remove users, assign roles, and manage permissions.</p>
            <button className="btn-primary">Manage Users</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Notifications</h3>
            <span className="card-badge">Enabled</span>
          </div>
          <div className="card-content">
            <p>Configure email and SMS alerts for incidents, lease expirations, and financial reports.</p>
            <button className="btn-primary">Configure</button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Integration</h3>
          </div>
          <div className="card-content">
            <p>Connect to accounting software, security systems, and vendor portals.</p>
            <button className="btn-primary" disabled>Coming Soon</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Backup & Export</h3>
          </div>
          <div className="card-content">
            <p>Schedule automatic data backups or export your property data as CSV/PDF.</p>
            <button className="btn-primary">Export Now</button>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3>System Preferences</h3>
        </div>
        <div className="card-content">
          <ul className="instructions-list">
            <li><strong>Timezone:</strong> UTC (Coordinated Universal Time)</li>
            <li><strong>Currency:</strong> US Dollar (USD)</li>
            <li><strong>Date Format:</strong> MM/DD/YYYY</li>
            <li><strong>Language:</strong> English</li>
          </ul>
          <p className="help-text">
            These settings affect how data is displayed across the Command Center.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;