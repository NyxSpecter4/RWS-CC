import React, { useState, useEffect } from 'react';
import './App.css';
import { supabase } from './lib/supabaseClient';
import LeaseManager from './pages/LeaseManager';
import RentRoll from './pages/RentRoll';
import FinancialDashboard from './pages/FinancialDashboard';
import Operations from './pages/Operations';
import DocumentAI from './pages/DocumentAI';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmedTenants, setConfirmedTenants] = useState([]);
  const [placeholderCount, setPlaceholderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'leaseManager', 'rentRoll', 'financialDashboard', 'operations', 'documentAI', 'reports', 'settings'
  const [leaseExpirations, setLeaseExpirations] = useState([]);
  const [openItemsCount, setOpenItemsCount] = useState(0);
  const [loadingBrief, setLoadingBrief] = useState(true);
  const [aiAlerts, setAiAlerts] = useState([]);
  const [loadingAiAlerts, setLoadingAiAlerts] = useState(true);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'etosha') {
      setAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

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

  useEffect(() => {
    async function fetchBriefData() {
      try {
        setLoadingBrief(true);
        // 1. Lease expirations within next month (fixed query)
        const today = new Date().toISOString().split('T')[0];
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        const nextMonthStr = nextMonth.toISOString().split('T')[0];

        // Get leases ONLY - no joins
        const { data: leases, error: leasesError } = await supabase
          .from('leases')
          .select('id, end_date, tenant_id, unit_id, base_rent, escalation_rate')
          .lte('end_date', nextMonthStr)
          .gte('end_date', today)
          .order('end_date', { ascending: true });

        if (leasesError) throw leasesError;

        let combinedLeases = [];
        if (leases && leases.length > 0) {
          // Get related data separately
          const tenantIds = [...new Set(leases.map(l => l.tenant_id).filter(Boolean))];
          const unitIds = [...new Set(leases.map(l => l.unit_id).filter(Boolean))];

          const [tenantsRes, unitsRes] = await Promise.all([
            tenantIds.length > 0
              ? supabase.from('tenants').select('id, name, contact_email').in('id', tenantIds)
              : { data: [], error: null },
            unitIds.length > 0
              ? supabase.from('units').select('id, suite_number, square_feet').in('id', unitIds)
              : { data: [], error: null }
          ]);

          // Combine everything into shape expected by UI
          combinedLeases = leases.map(lease => ({
            id: lease.id,
            end_date: lease.end_date,
            base_rent: lease.base_rent || 0,
            escalation_rate: lease.escalation_rate || 0,
            tenants: {
              name: tenantsRes.data?.find(t => t.id === lease.tenant_id)?.name || 'Unknown',
              contact_email: tenantsRes.data?.find(t => t.id === lease.tenant_id)?.contact_email || ''
            },
            units: {
              suite_number: unitsRes.data?.find(u => u.id === lease.unit_id)?.suite_number || 'N/A',
              square_feet: unitsRes.data?.find(u => u.id === lease.unit_id)?.square_feet || 0
            }
          }));
        }

        setLeaseExpirations(combinedLeases);

        // 2. Open work orders (status != 'completed')
        const { count: workOrdersCount, error: workOrdersError } = await supabase
          .from('work_orders')
          .select('*', { count: 'exact', head: true })
          .neq('status', 'completed');

        if (workOrdersError) throw workOrdersError;

        // 3. Open incidents (resolved = false)
        const { count: incidentsCount, error: incidentsError } = await supabase
          .from('incidents')
          .select('*', { count: 'exact', head: true })
          .eq('resolved', false);

        if (incidentsError) throw incidentsError;

        const totalOpen = (workOrdersCount || 0) + (incidentsCount || 0);
        setOpenItemsCount(totalOpen);

        // 4. Fetch AI alerts (status = 'new')
        const { data: alerts, error: alertsError } = await supabase
          .from('ai_alerts')
          .select('id, alert_type, priority, title, description, status, created_at, entity_type, entity_id, metadata')
          .eq('status', 'new')
          .order('created_at', { ascending: false });

        if (alertsError) throw alertsError;
        setAiAlerts(alerts || []);
      } catch (err) {
        console.error('Error fetching brief data:', err);
        // We can optionally set an error state, but for now just log
      } finally {
        setLoadingBrief(false);
        setLoadingAiAlerts(false);
      }
    }

    fetchBriefData();
  }, []);


  // Total tenant count
  const totalTenants = confirmedTenants.length + placeholderCount;

  const handleNavClick = (view, e) => {
    e.preventDefault();
    setCurrentView(view);
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      const { error } = await supabase
        .from('ai_alerts')
        .update({ status: 'acknowledged', updated_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;

      // Remove from local state
      setAiAlerts(prev => prev.filter(alert => alert.id !== alertId));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
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
    if (currentView === 'reports') {
      return <Reports />;
    }
    if (currentView === 'settings') {
      return <Settings />;
    }

    // Default dashboard view
    return (
      <>
        {/* Main Heading */}
        <header className="dashboard-header">
          <h2>Command Center Overview</h2>
          <p>Monitor your property's performance, incidents, and key tenants at a glance.</p>
        </header>

        {/* Quick Start Panel */}
        <section className="quick-start-panel">
          <h3>What do you need to do?</h3>
          <div className="quick-start-buttons">
            <button
              className="btn-warning"
              onClick={(e) => handleNavClick('operations', e)}
            >
              Report New Issue
            </button>
            <button
              className="btn-primary"
              onClick={(e) => handleNavClick('leaseManager', e)}
            >
              Add / Review Lease
            </button>
            <button
              className="btn-success"
              onClick={(e) => handleNavClick('financialDashboard', e)}
            >
              Check Property Value
            </button>
          </div>
        </section>

        {/* AI Morning Brief Widget */}
        <section className="ai-brief-widget">
          <h3>Your AI Brief</h3>
          <div className="brief-content">
            {loadingBrief ? (
              <p>Loading brief...</p>
            ) : aiAlerts.length === 0 ? (
              <p className="brief-empty">No new AI alerts.</p>
            ) : (
              aiAlerts.map(alert => (
                <div className="brief-item" key={alert.id}>
                  <div className="brief-header">
                    <span className="brief-title">{alert.title}</span>
                    <span className={`brief-badge ${alert.priority}`}>
                      {alert.priority}
                    </span>
                  </div>
                  <p className="brief-description">{alert.description}</p>
                  <div className="brief-footer">
                    <small>
                      {alert.alert_type} • {new Date(alert.created_at).toLocaleDateString()}
                    </small>
                    <button
                      className="btn-primary btn-small"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

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
                <p className="error-message color-redwood">{error}</p>
              ) : loading ? (
                <p>Loading tenants...</p>
              ) : (
                <>
                  <div className="tenant-list">
                    {confirmedTenants.length > 0 ? (
                      <>
                        {confirmedTenants.slice(0, 4).map(tenant => (
                          <div className="tenant-item" key={tenant.id}>
                            <strong>{tenant.name}</strong>
                            <span>{tenant.category}</span>
                          </div>
                        ))}
                        {confirmedTenants.length > 4 && (
                          <div className="tenant-item" style={{ justifyContent: 'center', paddingTop: '0.5rem' }}>
                            <a
                              href="#"
                              onClick={(e) => { e.preventDefault(); handleNavClick('leaseManager', e); }}
                              className="color-turquoise"
                              style={{ textDecoration: 'none', fontWeight: '600' }}
                            >
                              View All ({confirmedTenants.length})
                            </a>
                          </div>
                        )}
                      </>
                    ) : (
                      <p>No confirmed tenants found.</p>
                    )}
                  </div>
                  {placeholderCount > 0 && (
                    <p className="placeholder-note color-redwood" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                      +{placeholderCount} placeholder units to fill
                    </p>
                  )}
                </>
              )}
              <button className="btn-primary" style={{ marginTop: '0.5rem' }}>Manage Tenants</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="App">
      {!authenticated ? (
        <div className="password-modal-overlay">
          <div className="password-modal">
            <h2>Redwood Square Command Center</h2>
            <p>Enter password to access the dashboard</p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="password-input"
                autoFocus
              />
              {passwordError && <p className="password-error">{passwordError}</p>}
              <button type="submit" className="btn-primary">
                Access
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
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
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="/leases"
                    className="nav-links"
                    onClick={(e) => handleNavClick('leaseManager', e)}
                  >
                    All Leases
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="/rent-roll"
                    className="nav-links"
                    onClick={(e) => handleNavClick('rentRoll', e)}
                  >
                    Income
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="/financials"
                    className="nav-links"
                    onClick={(e) => handleNavClick('financialDashboard', e)}
                  >
                    Value & Finances
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="/operations"
                    className="nav-links"
                    onClick={(e) => handleNavClick('operations', e)}
                  >
                    Work & Incidents
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
                <li className="nav-item">
                  <a
                    href="#reports"
                    className="nav-links"
                    onClick={(e) => handleNavClick('reports', e)}
                  >
                    Reports
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="#settings"
                    className="nav-links"
                    onClick={(e) => handleNavClick('settings', e)}
                  >
                    Settings
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
        </>
      )}
    </div>
  );
}

export default App;
