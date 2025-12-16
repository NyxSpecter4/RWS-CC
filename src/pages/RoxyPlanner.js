import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './RoxyPlanner.css';

const RoxyPlanner = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categorized alerts
  const [urgent, setUrgent] = useState([]);
  const [thisWeek, setThisWeek] = useState([]);
  const [thisMonth, setThisMonth] = useState([]);
  const [nextThreeMonths, setNextThreeMonths] = useState([]);

  // Fetch all alerts from ai_alerts table
  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('ai_alerts')
          .select('*')
          .eq('status', 'new')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAlerts(data || []);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  // Categorize alerts based on dates and priority
  useEffect(() => {
    if (alerts.length === 0) {
      setUrgent([]);
      setThisWeek([]);
      setThisMonth([]);
      setNextThreeMonths([]);
      return;
    }

    const today = new Date();
    const urgentList = [];
    const thisWeekList = [];
    const thisMonthList = [];
    const nextThreeMonthsList = [];

    alerts.forEach(alert => {
      // Determine if alert is linked to a lease with end_date
      const metadata = alert.metadata || {};
      const endDateStr = metadata.end_date;
      let daysUntil = null;
      if (endDateStr) {
        const endDate = new Date(endDateStr);
        daysUntil = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      }

      // Priority mapping
      const priority = alert.priority?.toLowerCase() || 'medium';

      // Categorization logic
      // URGENT: priority = 'critical' OR 'high' OR lease end_date within 7 days
      if (priority === 'critical' || priority === 'high' || (daysUntil !== null && daysUntil <= 7)) {
        urgentList.push({ ...alert, daysUntil });
      }
      // THIS WEEK: lease end_date within 8-30 days OR priority = 'medium'
      else if ((daysUntil !== null && daysUntil >= 8 && daysUntil <= 30) || priority === 'medium') {
        thisWeekList.push({ ...alert, daysUntil });
      }
      // THIS MONTH: lease end_date within 31-90 days
      else if (daysUntil !== null && daysUntil >= 31 && daysUntil <= 90) {
        thisMonthList.push({ ...alert, daysUntil });
      }
      // NEXT 3 MONTHS: all other active alerts (status = 'new')
      else {
        nextThreeMonthsList.push({ ...alert, daysUntil });
      }
    });

    setUrgent(urgentList);
    setThisWeek(thisWeekList);
    setThisMonth(thisMonthList);
    setNextThreeMonths(nextThreeMonthsList);
  }, [alerts]);

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return '#E53E3E';
      case 'high': return '#ED8936';
      case 'medium': return '#ECC94B';
      case 'low': return '#38A169';
      default: return '#718096';
    }
  };

  const getRelatedEntityDisplay = (alert) => {
    const metadata = alert.metadata || {};
    if (metadata.tenant_id && metadata.unit_id) {
      return `Tenant ${metadata.tenant_id} - Unit ${metadata.unit_id}`;
    }
    if (alert.related_entity_id) {
      return `Entity ${alert.related_entity_id}`;
    }
    return 'General';
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      const { error } = await supabase
        .from('ai_alerts')
        .update({ status: 'acknowledged', updated_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;

      // Remove from local state
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  if (loading) {
    return (
      <div className="roxy-container">
        <div className="roxy-header">
          <h1>Roxy's Planner</h1>
          <p>Loading your proactive alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="roxy-container">
        <div className="roxy-header">
          <h1>Roxy's Planner</h1>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="roxy-container">
      {/* Header with avatar */}
      <header className="roxy-header">
        <div className="roxy-title-section">
          <h1>Roxy's Planner – Your Day, Week, & Month Ahead</h1>
          <p>AI‑powered foresight organized by urgency and timeframe.</p>
        </div>
        <div className="roxy-avatar">
          <div className="avatar-circle">RX</div>
        </div>
      </header>

      {/* Four-column Kanban board */}
      <div className="kanban-board">
        {/* URGENT column */}
        <div className="kanban-column urgent-column">
          <div className="column-header">
            <h2>URGENT (Now)</h2>
            <span className="column-count">{urgent.length}</span>
          </div>
          <div className="column-cards">
            {urgent.length === 0 ? (
              <div className="empty-card">No urgent alerts</div>
            ) : (
              urgent.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  getPriorityColor={getPriorityColor}
                  getRelatedEntityDisplay={getRelatedEntityDisplay}
                  acknowledgeAlert={acknowledgeAlert}
                />
              ))
            )}
          </div>
        </div>

        {/* THIS WEEK column */}
        <div className="kanban-column week-column">
          <div className="column-header">
            <h2>THIS WEEK</h2>
            <span className="column-count">{thisWeek.length}</span>
          </div>
          <div className="column-cards">
            {thisWeek.length === 0 ? (
              <div className="empty-card">No alerts this week</div>
            ) : (
              thisWeek.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  getPriorityColor={getPriorityColor}
                  getRelatedEntityDisplay={getRelatedEntityDisplay}
                  acknowledgeAlert={acknowledgeAlert}
                />
              ))
            )}
          </div>
        </div>

        {/* THIS MONTH column */}
        <div className="kanban-column month-column">
          <div className="column-header">
            <h2>THIS MONTH</h2>
            <span className="column-count">{thisMonth.length}</span>
          </div>
          <div className="column-cards">
            {thisMonth.length === 0 ? (
              <div className="empty-card">No alerts this month</div>
            ) : (
              thisMonth.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  getPriorityColor={getPriorityColor}
                  getRelatedEntityDisplay={getRelatedEntityDisplay}
                  acknowledgeAlert={acknowledgeAlert}
                />
              ))
            )}
          </div>
        </div>

        {/* NEXT 3 MONTHS column */}
        <div className="kanban-column quarter-column">
          <div className="column-header">
            <h2>NEXT 3 MONTHS</h2>
            <span className="column-count">{nextThreeMonths.length}</span>
          </div>
          <div className="column-cards">
            {nextThreeMonths.length === 0 ? (
              <div className="empty-card">No alerts in next 3 months</div>
            ) : (
              nextThreeMonths.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  getPriorityColor={getPriorityColor}
                  getRelatedEntityDisplay={getRelatedEntityDisplay}
                  acknowledgeAlert={acknowledgeAlert}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Summary footer */}
      <footer className="roxy-summary">
        <p>
          Total proactive alerts: <strong>{alerts.length}</strong> • 
          Urgent: <strong>{urgent.length}</strong> • 
          This week: <strong>{thisWeek.length}</strong> • 
          This month: <strong>{thisMonth.length}</strong> • 
          Next 3 months: <strong>{nextThreeMonths.length}</strong>
        </p>
      </footer>
    </div>
  );
};

// Alert Card Component
const AlertCard = ({ alert, getPriorityColor, getRelatedEntityDisplay, acknowledgeAlert }) => {
  const priority = alert.priority?.toLowerCase() || 'medium';
  const borderColor = getPriorityColor(priority);

  return (
    <div className="alert-card" style={{ borderLeft: `4px solid ${borderColor}` }}>
      <div className="card-header">
        <h3 className="card-title">{alert.title}</h3>
        <span className="priority-badge" style={{ backgroundColor: borderColor }}>
          {priority.toUpperCase()}
        </span>
      </div>
      <p className="card-description">{alert.description}</p>
      <div className="card-meta">
        <span className="related-entity">
          {getRelatedEntityDisplay(alert)}
        </span>
        <span className="alert-date">
          {new Date(alert.created_at).toLocaleDateString()}
        </span>
      </div>
      <div className="card-actions">
        <button
          className="btn-acknowledge"
          onClick={() => acknowledgeAlert(alert.id)}
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};

export default RoxyPlanner;