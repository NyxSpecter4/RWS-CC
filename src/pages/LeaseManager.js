import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function LeaseManager() {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseRent, setBaseRent] = useState('');
  const [escalationRate, setEscalationRate] = useState('0.05'); // Default 5%
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Fetch tenants on component load
  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    const { data, error } = await supabase
      .from('tenants')
      .select('id, name')
      .eq('is_placeholder', false)
      .order('name');
    if (error) console.error('Error fetching tenants:', error);
    else setTenants(data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    const { error } = await supabase
      .from('leases')
      .insert([{
        tenant_id: selectedTenant,
        start_date: startDate,
        end_date: endDate,
        base_rent: parseFloat(baseRent),
        escalation_rate: parseFloat(escalationRate),
        is_active: true
      }]);

    if (error) {
      setMessage('Error saving lease: ' + error.message);
      setMessageType('error');
    } else {
      setMessage('Lease saved successfully!');
      setMessageType('success');
      // Clear form
      setSelectedTenant('');
      setStartDate('');
      setEndDate('');
      setBaseRent('');
    }
  };

  return (
    <div className="dashboard-grid" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Add New Lease</h3>
          <span className="card-badge">Lease Manager</span>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Tenant</label>
              <select
                value={selectedTenant}
                onChange={e => setSelectedTenant(e.target.value)}
                required
              >
                <option value="">Select a tenant</option>
                {tenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Base Rent ($)</label>
              <input
                type="number"
                step="0.01"
                value={baseRent}
                onChange={e => setBaseRent(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Annual Escalation Rate</label>
              <select
                value={escalationRate}
                onChange={e => setEscalationRate(e.target.value)}
              >
                <option value="0.05">5% (Standard)</option>
                <option value="0.03">3% (Large Tenant)</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
              Save Lease
            </button>
          </form>

          {message && (
            <div className={`message ${messageType === 'error' ? 'error' : ''}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeaseManager;
