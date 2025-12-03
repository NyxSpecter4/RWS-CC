import React from 'react';
import './../App.css';

const Reports = () => {
  return (
    <div className="page-container">
      <header className="dashboard-header">
        <h2>Reports</h2>
        <p>Financial, CAM, and Incident reports will be generated here.</p>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Financial Reports</h3>
            <span className="card-badge">Coming Soon</span>
          </div>
          <div className="card-content">
            <p>Monthly income statements, balance sheets, and cash‑flow summaries.</p>
            <button className="btn-primary" disabled>Generate</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>CAM Reconciliation</h3>
            <span className="card-badge">Q4 2025</span>
          </div>
          <div className="card-content">
            <p>Common Area Maintenance charges allocated to tenants.</p>
            <button className="btn-primary" disabled>View Details</button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Incident Logs</h3>
            <span className="card-badge">3 Active</span>
          </div>
          <div className="card-content">
            <p>Track and export incident reports for insurance and compliance.</p>
            <button className="btn-primary" disabled>Export PDF</button>
          </div>
        </div>
      </div>

      <div className="dashboard-card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3>Report Schedule</h3>
        </div>
        <div className="card-content">
          <ul className="instructions-list">
            <li><strong>Monthly:</strong> Rent Roll, Income Statement</li>
            <li><strong>Quarterly:</strong> CAM Reconciliation, Vendor Performance</li>
            <li><strong>Annual:</strong> Property Valuation, Tax Documents</li>
          </ul>
          <p className="help-text">
            Reports are automatically generated on the 1st of each month. You can also trigger manual generation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reports;