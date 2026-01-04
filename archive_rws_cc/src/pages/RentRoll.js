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
      // Fetch active leases with tenant, unit, and lease_charges details
      const { data, error } = await supabase
        .from('leases')
        .select(`
          id,
          start_date,
          end_date,
          tenants ( name ),
          units ( suite_number, square_feet ),
          lease_charges ( charge_type, rate, escalation_rate )
        `)
        .eq('is_active', true);

      if (error) throw error;

      // Process each lease
      const processed = data.map(lease => {
        const tenantName = lease.tenants?.name || 'Unknown';
        const suite = lease.units?.suite_number || 'N/A';
        const squareFeet = lease.units?.square_feet || 0;

        // Filter base rent charges
        const baseCharges = lease.lease_charges?.filter(ch => ch.charge_type === 'base_rent') || [];
        
        // Calculate total base rent (sum of rates)
        const totalBaseRate = baseCharges.reduce((sum, ch) => sum + (ch.rate || 0), 0);
        
        // Calculate current monthly rent by escalating each charge individually
        let currentRent = 0;
        let weightedEscalation = 0;
        baseCharges.forEach(ch => {
          const escalated = calculateCurrentRent(ch.rate || 0, ch.escalation_rate || 0, lease.start_date);
          currentRent += escalated;
          // For weighted escalation (for display)
          weightedEscalation += (ch.escalation_rate || 0) * (ch.rate || 0);
        });
        
        // Compute weighted average escalation rate (for display)
        const escalationRate = totalBaseRate > 0 ? weightedEscalation / totalBaseRate : 0;

        // Base rate per sq ft (rounded to 4 decimal places for precision)
        const baseRatePerSqFt = squareFeet > 0 ? totalBaseRate / squareFeet : 0;

        return {
          id: lease.id,
          tenant_name: tenantName,
          suite,
          square_feet: squareFeet,
          base_rate_per_sqft: baseRatePerSqFt,
          escalation_rate: escalationRate,
          current_monthly_rent: currentRent,
          end_date: lease.end_date,
          start_date: lease.start_date,
        };
      });

      setLeases(processed);

      // Compute total monthly income
      const total = processed.reduce((sum, lease) => sum + lease.current_monthly_rent, 0);
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

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
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
                <th>Sq Ft</th>
                <th>Base Rate ($/sq ft)</th>
                <th>Escalation Rate</th>
                <th>Current Monthly Rent</th>
                <th>Lease End Date</th>
              </tr>
            </thead>
            <tbody>
              {leases.length > 0 ? (
                leases.map(lease => (
                  <tr key={lease.id}>
                    <td>{lease.tenant_name}</td>
                    <td>{lease.suite}</td>
                    <td>{formatNumber(lease.square_feet)}</td>
                    <td>{formatCurrency(lease.base_rate_per_sqft)}</td>
                    <td>{formatPercent(lease.escalation_rate)}</td>
                    <td><strong>{formatCurrency(lease.current_monthly_rent)}</strong></td>
                    <td>{formatDate(lease.end_date)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No active leases found.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                  Total Monthly Income:
                </td>
                <td colSpan="2" style={{ fontWeight: 'bold' }}>
                  {formatCurrency(totalIncome)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RentRoll;