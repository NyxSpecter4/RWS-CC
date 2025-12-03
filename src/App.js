import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './lib/supabaseClient';
import LeaseManager from './pages/LeaseManager';
import RentRoll from './pages/RentRoll';
import FinancialDashboard from './pages/FinancialDashboard';
import Operations from './pages/Operations';
import DocumentAI from './pages/DocumentAI';

function App() {
  const [confirmedTenants, setConfirmedTenants] = useState([]);
  const [placeholderCount, setPlaceholderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'leaseManager', 'rentRoll', 'financialDashboard', 'operations', 'documentAI'

  useEffect(() => {
    async function fetchTenants() {
      try {
        setLoading(true);
        // Fetch confirmed tenants (is_placeholder = false)
        const { data: confirmedData, error: confirmedError } = await supabase
          .from('tenants')
          .select('id, name, category')
          .eq('is_placeholder', false);

        if (confirmedError) throw confirmedError;
        setConfirmedTenants(confirmedData || []);

        // Fetch placeholder count (is_placeholder = true)
        const { count, error: countError } = await supabase
          .from('tenants')
          .select('*', { count: 'exact', head: true })
          .eq('is_placeholder', true);

        if (countError) throw countError;
        setPlaceholderCount(count || 0);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Failed to load tenant data.');
      } finally {
        setLoading(false);
      }
    }

    fetchTenants();
  }, []);

  // Total tenant count
  const totalTenants = confirmedTenants.length + placeholderCount;

  const handleNavClick = (view, e) => {
    e.preventDefault();
    setCurrentView(view);
  };

  const renderContent = () => {
    if (currentView === 'leaseManager') {
      return <LeaseManager />;
    }
    if (currentView === 'rentRoll') {
      return <RentRoll />;
    }
    if (currentView === 'financialDashboard') {
      return <FinancialDashboard />;
    }
    if (currentView === 'operations') {
      return <Operations />;
    }
    if (currentView === 'documentAI') {
      return <DocumentAI />;
    }

    // Default dashboard view
    return (
      <>
        {/* Main Heading */}
        <header className="dashboard-header">
          <h2>Command Center Overview</h2>
          <p>Monitor your property's performance, incidents, and key tenants at a glance.</p>
        </header>

        {/* Grid Layout for Cards */}
        <div className="dashboard-grid">
          {/* Card 1: Valuation Snapshot */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Valuation Snapshot</h3>
              <span className="card-badge">Updated Today</span>
            </div>
            <div className="card-content">
              <p className="valuation-amount">$12,450,000</p>
              <p className="valuation-change">+2.3% from last quarter</p>
              <button className="btn-primary">View Details</button>
            </div>
          </div>

          {/* Card 2: Recent Incidents */}
          <div className="dashboard-card card-warning">
            <div className="card-header">
              <h3>Recent Incidents</h3>
              <span className="card-badge warning">3 Active</span>
            </div>
            <div className="card-content">
              <ul className="incident-list">
                <li>Elevator outage - Floor 15</li>
                <li>Water leak - Parking level B2</li>
                <li>Security alert - Unauthorized access</li>
              </ul>
              <button className="btn-warning">Resolve Now</button>
            </div>
          </div>

          {/* Card 3: Key Tenants */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Key Tenants</h3>
              <span className="card-badge">{loading ? '...' : `${totalTenants} Total`}</span>
            </div>
            <div className="card-content">
              {error ? (
                <p className="error-message" style={{ color: '#9C4A3C' }}>{error}</p>
              ) : loading ? (
                <p>Loading tenants...</p>
              ) : (
                <>
                  <div className="tenant-list">
                    {confirmedTenants.length > 0 ? (
                      confirmedTenants.map(tenant => (
                        <div className="tenant-item" key={tenant.id}>
                          <strong>{tenant.name}</strong>
                          <span>{tenant.category}</span>
                        </div>
                      ))
                    ) : (
                      <p>No confirmed tenants found.</p>
                    )}
                  </div>
                  {placeholderCount > 0 && (
                    <p className="placeholder-note" style={{ color: '#9C4A3C', marginTop: '1rem', fontSize: '0.9rem' }}>
                      +{placeholderCount} placeholder units to fill
                    </p>
                  )}
                </>
              )}
              <button className="btn-primary">Manage Tenants</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="App">
      {/* Top Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-logo">Redwood Square Command Center</h1>
          <ul className="nav-menu">
            <li className="nav-item">
              <a
                href="#dashboard"
                className="nav-links"
                onClick={(e) => handleNavClick('dashboard', e)}
              >
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#reports"
                className="nav-links"
                onClick={(e) => handleNavClick('dashboard', e)}
              >
                Reports
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#settings"
                className="nav-links"
                onClick={(e) => handleNavClick('dashboard', e)}
              >
                Settings
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/leases"
                className="nav-links"
                onClick={(e) => handleNavClick('leaseManager', e)}
              >
                Lease Manager
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/rent-roll"
                className="nav-links"
                onClick={(e) => handleNavClick('rentRoll', e)}
              >
                Rent Roll
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/financials"
                className="nav-links"
                onClick={(e) => handleNavClick('financialDashboard', e)}
              >
                Financials
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/operations"
                className="nav-links"
                onClick={(e) => handleNavClick('operations', e)}
              >
                Operations
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/ai-tools"
                className="nav-links"
                onClick={(e) => handleNavClick('documentAI', e)}
              >
                AI Tools
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {renderContent()}

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Redwood Square Command Center &copy; {new Date().getFullYear()} | Data refreshes every 15 minutes</p>
      </footer>
    </div>
  );
}

export default App;
