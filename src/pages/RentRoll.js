import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function RentRoll() {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    fetchRentRoll();
  }, []);

  const fetchRentRoll = async () => {
    try {
      setLoading(true);
      // Fetch active leases with tenant details
      const { data, error } = await supabase
        .from('leases')
        .select(`
          id,
          tenant_id,
          start_date,
          end_date,
          base_rent,
          escalation_rate,
          is_active,
          tenants ( name, suite )
        `)
        .eq('is_active', true);

      if (error) throw error;

      // Calculate current rent for each lease
      const processed = data.map(lease => {
        const currentRent = calculateCurrentRent(
          lease.base_rent,
          lease.escalation_rate,
          lease.start_date
        );
        return {
          ...lease,
          tenant_name: lease.tenants?.name || 'Unknown',
          suite: lease.tenants?.suite || 'N/A',
          current_rent: currentRent,
        };
      });

      setLeases(processed);

      // Compute total monthly income
      const total = processed.reduce((sum, lease) => sum + lease.current_rent, 0);
      setTotalIncome(total);
    } catch (err) {
      console.error('Error fetching rent roll:', err);
      setError('Failed to load rent roll data.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate current rent based on formula
  const calculateCurrentRent = (baseRent, escalationRate, startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    // Adjust if month/day hasn't passed
    if (now.getMonth() < start.getMonth() ||
        (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) {
      years--;
    }
    // If years negative (lease hasn't started), use base rent
    if (years < 0) years = 0;
    const current = baseRent * Math.pow(1 + escalationRate, years);
    return Math.round(current * 100) / 100; // round to 2 decimal places
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (rate) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="dashboard-grid" style={{ maxWidth: '1200px', margin: '2rem auto' }}>
        <div className="dashboard-card">
          <div className="card-content">
            <p>Loading rent roll...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-grid" style={{ maxWidth: '1200px', margin: '2rem auto' }}>
        <div className="dashboard-card">
          <div className="card-content">
            <p className="error-message" style={{ color: '#9C4A3C' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-grid" style={{ maxWidth: '1200px', margin: '2rem auto' }}>
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Redwood Square - Rent Roll</h3>
          <span className="card-badge">
            Total Monthly Income: {formatCurrency(totalIncome)}
          </span>
        </div>
        <div className="card-content">
          <table className="rent-roll-table">
            <thead>
              <tr>
                <th>Tenant Name</th>
                <th>Suite</th>
                <th>Base Rent</th>
                <th>Escalation Rate</th>
                <th>Current Rent</th>
                <th>Lease End Date</th>
              </tr>
            </thead>
            <tbody>
              {leases.length > 0 ? (
                leases.map(lease => (
                  <tr key={lease.id}>
                    <td>{lease.tenant_name}</td>
                    <td>{lease.suite}</td>
                    <td>{formatCurrency(lease.base_rent)}</td>
                    <td>{formatPercent(lease.escalation_rate)}</td>
                    <td><strong>{formatCurrency(lease.current_rent)}</strong></td>
                    <td>{formatDate(lease.end_date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No active leases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RentRoll;