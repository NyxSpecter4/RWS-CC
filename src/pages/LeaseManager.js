import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function LeaseManager() {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [ratePerSqFt, setRatePerSqFt] = useState('');
  const [camChecked, setCamChecked] = useState(false);
  const [escalationRate, setEscalationRate] = useState('0.05'); // Default 5%
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Fetch tenants and units on component load
  useEffect(() => {
    fetchTenants();
    fetchUnits();
  }, []);

  // Debug selected unit
  useEffect(() => {
    if (selectedUnit) {
      const unitObj = units.find(u => u.id === selectedUnit);
      console.log('Selected unit:', unitObj);
    }
  }, [selectedUnit, units]);

  const fetchTenants = async () => {
    const { data, error } = await supabase
      .from('tenants')
      .select('id, name')
      .eq('is_placeholder', false)
      .order('name');
    if (error) console.error('Error fetching tenants:', error);
    else setTenants(data || []);
  };

  const fetchUnits = async () => {
    const { data, error } = await supabase
      .from('units')
      .select('id, suite_number, square_feet')
      .order('suite_number');
    if (error) console.error('Error fetching units:', error);
    else {
      console.log('Available units:', data);
      setUnits(data || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    // Validate inputs
    if (!selectedTenant || !selectedUnit || !startDate || !endDate || !ratePerSqFt) {
      setMessage('Please fill all required fields.');
      setMessageType('error');
      return;
    }

    const selectedUnitObj = units.find(u => u.id === selectedUnit);
    if (!selectedUnitObj) {
      setMessage('Selected unit not found.');
      setMessageType('error');
      return;
    }

    const squareFeet = selectedUnitObj.square_feet;
    const rate = parseFloat(ratePerSqFt);
    if (isNaN(rate) || rate <= 0) {
      setMessage('Please enter a valid rate per sq ft.');
      setMessageType('error');
      return;
    }

    const monthlyBaseRent = rate * squareFeet;

    // Insert into leases table (master record)
    const { data: leaseData, error: leaseError } = await supabase
      .from('leases')
      .insert([{
        tenant_id: selectedTenant,
        unit_id: selectedUnit,
        start_date: startDate,
        end_date: endDate,
        is_active: true
      }])
      .select('id');

    if (leaseError) {
      setMessage('Error saving lease: ' + leaseError.message);
      setMessageType('error');
      return;
    }

    const leaseId = leaseData[0]?.id;
    if (!leaseId) {
      setMessage('Failed to retrieve lease ID.');
      setMessageType('error');
      return;
    }

    // Insert base rent charge
    const { error: baseRentError } = await supabase
      .from('lease_charges')
      .insert([{
        lease_id: leaseId,
        charge_type: 'base_rent',
        rate: monthlyBaseRent,
        escalation_rate: parseFloat(escalationRate),
        is_recoverable: false
      }]);

    if (baseRentError) {
      setMessage('Error saving base rent charge: ' + baseRentError.message);
      setMessageType('error');
      return;
    }

    // Insert CAM charge if checked
    if (camChecked) {
      const { error: camError } = await supabase
        .from('lease_charges')
        .insert([{
          lease_id: leaseId,
          charge_type: 'cam',
          rate: 0, // placeholder, to be calculated later
          escalation_rate: 0,
          is_recoverable: true
        }]);

      if (camError) {
        setMessage('Error saving CAM charge: ' + camError.message);
        setMessageType('error');
        return;
      }
    }

    setMessage('Lease saved successfully with detailed charges!');
    setMessageType('success');
    // Clear form
    setSelectedTenant('');
    setSelectedUnit('');
    setStartDate('');
    setEndDate('');
    setRatePerSqFt('');
    setCamChecked(false);
    setEscalationRate('0.05');
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
              <label>Unit</label>
              <select
                value={selectedUnit}
                onChange={e => setSelectedUnit(e.target.value)}
                required
              >
                <option value="">Select a unit</option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.suite_number} ({unit.square_feet} sq ft)
                  </option>
                ))}
              </select>
            </div>

            {selectedUnit && (
              <div className="form-group">
                <label className="form-label">Unit Square Feet</label>
                <input
                  type="number"
                  value={units.find(u => u.id === selectedUnit)?.square_feet || 0}
                  readOnly
                  className="form-control"
                  placeholder="Auto-filled from selected unit"
                />
                <small className="text-muted">
                  Square footage is automatically pulled from the units table
                </small>
              </div>
            )}

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
              <label>Rate per Sq Ft ($)</label>
              <input
                type="number"
                step="0.01"
                value={ratePerSqFt}
                onChange={e => setRatePerSqFt(e.target.value)}
                required
              />
              <small>Enter the rate per square foot per month.</small>
            </div>

            <div className="form-group">
              <label>Calculated Monthly Base Rent</label>
              <input
                type="text"
                readOnly
                value={
                  selectedUnit && ratePerSqFt && !isNaN(parseFloat(ratePerSqFt))
                    ? `$${(
                        parseFloat(ratePerSqFt) *
                        (units.find(u => u.id === selectedUnit)?.square_feet || 0)
                      ).toFixed(2)}`
                    : '$0.00'
                }
                style={{ backgroundColor: '#f9f9f9', color: '#555', cursor: 'not-allowed' }}
              />
              <small>Based on unit's square footage.</small>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="cam-checkbox"
                checked={camChecked}
                onChange={e => setCamChecked(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor="cam-checkbox" style={{ marginBottom: 0 }}>
                Tenant pays CAM (Common Area Maintenance)
              </label>
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
