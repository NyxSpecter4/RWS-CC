import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function FinancialDashboard() {
  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [capRate, setCapRate] = useState(0.065); // Default 6.5%

  // Hardcoded annual operating expenses (placeholder)
  const annualExpenses = 200000; // $200,000

  useEffect(() => {
    fetchTotalMonthlyIncome();
  }, []);

  const fetchTotalMonthlyIncome = async () => {
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

      // Calculate current rent for each lease and sum
      let total = 0;
      data.forEach(lease => {
        const currentRent = calculateCurrentRent(
          lease.base_rent,
          lease.escalation_rate,
          lease.start_date
        );
        total += currentRent;
      });

      setTotalMonthlyIncome(total);
    } catch (err) {
      console.error('Error fetching leases for income:', err);
      setError('Failed to load income data.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate current rent based on formula (same as RentRoll)
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (rate) => {
    return `${(rate * 100).toFixed(2)}%`;
  };

  // Calculations
  const annualIncome = totalMonthlyIncome * 12;
  const noi = annualIncome - annualExpenses;
  const valuation = capRate > 0 ? noi / capRate : 0;

  if (loading) {
    return (
      <div className="dashboard-grid" style={{ maxWidth: '1200px', margin: '2rem auto' }}>
        <div className="dashboard-card">
          <div className="card-content">
            <p>Loading financial data...</p>
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
      {/* Header */}
      <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
        <div className="card-header">
          <h3>Financial Dashboard</h3>
          <span className="card-badge">Property Valuation & NOI</span>
        </div>
        <div className="card-content">
          <p>Monitor your property's financial performance, net operating income, and estimated valuation.</p>
        </div>
      </div>

      {/* Card 1: Annualized Income */}
      <div className="dashboard-card">
        <div className="card-header">
          <h4>Annualized Income</h4>
          <span className="card-badge">From Rent Roll</span>
        </div>
        <div className="card-content">
          <p className="valuation-amount" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {formatCurrency(annualIncome)}
          </p>
          <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            Based on monthly total of {formatCurrency(totalMonthlyIncome)}
          </p>
        </div>
      </div>

      {/* Card 2: Annual Operating Expenses */}
      <div className="dashboard-card">
        <div className="card-header">
          <h4>Annual Operating Expenses</h4>
          <span className="card-badge warning" style={{ backgroundColor: '#9C4A3C' }}>
            Placeholder
          </span>
        </div>
        <div className="card-content">
          <p className="valuation-amount" style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#9C4A3C' }}>
            {formatCurrency(annualExpenses)}
          </p>
          <p style={{ color: '#9C4A3C', fontSize: '0.9rem', fontStyle: 'italic' }}>
            Placeholder – Input Actual Expenses
          </p>
        </div>
      </div>

      {/* Card 3: Net Operating Income (NOI) */}
      <div className="dashboard-card">
        <div className="card-header">
          <h4>Net Operating Income (NOI)</h4>
          <span className="card-badge" style={{ backgroundColor: '#27ae60' }}>
            Annual
          </span>
        </div>
        <div className="card-content">
          <p className="valuation-amount" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#27ae60' }}>
            {formatCurrency(noi)}
          </p>
          <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            = Income {formatCurrency(annualIncome)} – Expenses {formatCurrency(annualExpenses)}
          </p>
        </div>
      </div>

      {/* Card 4: Valuation Calculator */}
      <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
        <div className="card-header">
          <h4>Valuation Calculator</h4>
          <span className="card-badge">Cap Rate Driven</span>
        </div>
        <div className="card-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="capRate" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                Market Cap Rate: <strong>{formatPercent(capRate)}</strong>
              </label>
              <input
                id="capRate"
                type="range"
                min="5"
                max="10"
                step="0.25"
                value={capRate * 100}
                onChange={(e) => setCapRate(parseFloat(e.target.value) / 100)}
                style={{ width: '100%', height: '10px', borderRadius: '5px', background: '#e2e8f0', outline: 'none' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: '#7f8c8d' }}>
                <span>5%</span>
                <span>10%</span>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#2c3e50' }}>
                Property Valuation
              </h5>
              <p className="valuation-amount" style={{ fontSize: '3rem', color: '#2c3e50', margin: '0' }}>
                {formatCurrency(valuation)}
              </p>
              <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Calculated as NOI ÷ Cap Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialDashboard;