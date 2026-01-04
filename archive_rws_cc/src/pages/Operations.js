import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

function Operations() {
  // Incident Log state
  const [incidents, setIncidents] = useState([]);
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');
  const [incidentSeverity, setIncidentSeverity] = useState('3');
  const [incidentLocation, setIncidentLocation] = useState('');
  const [incidentLoading, setIncidentLoading] = useState(false);

  // Work Order state
  const [workOrders, setWorkOrders] = useState([]);
  const [workOrderTitle, setWorkOrderTitle] = useState('');
  const [workOrderDescription, setWorkOrderDescription] = useState('');
  const [workOrderPriority, setWorkOrderPriority] = useState('Medium');
  const [workOrderVendor, setWorkOrderVendor] = useState('');
  const [workOrderLoading, setWorkOrderLoading] = useState(false);

  // Vendor contacts static data
  const vendorContacts = [
    { type: 'Security', contact: 'Acme Security Co. – (555) 123-4567' },
    { type: 'Landscaping', contact: 'Green Thumb Landscaping – (555) 987-6543' },
    { type: 'Towing', contact: 'Quick Tow Services – (555) 555-1212' },
    { type: 'General Maintenance', contact: 'Fix‑It All Maintenance – (555) 888-9999' },
  ];

  // Fetch incidents on load
  useEffect(() => {
    fetchIncidents();
    fetchWorkOrders();
  }, []);

  const fetchIncidents = async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) console.error('Error fetching incidents:', error);
    else setIncidents(data || []);
  };

  const fetchWorkOrders = async () => {
    const { data, error } = await supabase
      .from('work_orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching work orders:', error);
    else setWorkOrders(data || []);
  };

  const handleAddIncident = async (e) => {
    e.preventDefault();
    setIncidentLoading(true);
    const { error } = await supabase
      .from('incidents')
      .insert([{
        title: incidentTitle,
        description: incidentDescription,
        severity: parseInt(incidentSeverity),
        location: incidentLocation,
        status: 'open',
        created_at: new Date().toISOString(),
      }]);
    if (error) {
      console.error('Error adding incident:', error);
      alert('Failed to add incident.');
    } else {
      setIncidentTitle('');
      setIncidentDescription('');
      setIncidentSeverity('3');
      setIncidentLocation('');
      fetchIncidents();
    }
    setIncidentLoading(false);
  };

  const handleAddWorkOrder = async (e) => {
    e.preventDefault();
    setWorkOrderLoading(true);
    const { error } = await supabase
      .from('work_orders')
      .insert([{
        title: workOrderTitle,
        description: workOrderDescription,
        priority: workOrderPriority,
        assigned_vendor: workOrderVendor,
        status: 'Open',
        created_at: new Date().toISOString(),
      }]);
    if (error) {
      console.error('Error adding work order:', error);
      alert('Failed to add work order.');
    } else {
      setWorkOrderTitle('');
      setWorkOrderDescription('');
      setWorkOrderPriority('Medium');
      setWorkOrderVendor('');
      fetchWorkOrders();
    }
    setWorkOrderLoading(false);
  };

  const updateWorkOrderStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('work_orders')
      .update({ status: newStatus })
      .eq('id', id);
    if (error) console.error('Error updating work order:', error);
    else fetchWorkOrders();
  };

  // Group work orders by status for kanban
  const groupedWorkOrders = {
    'Open': workOrders.filter(wo => wo.status === 'Open'),
    'Assigned': workOrders.filter(wo => wo.status === 'Assigned'),
    'In Progress': workOrders.filter(wo => wo.status === 'In Progress'),
    'Completed': workOrders.filter(wo => wo.status === 'Completed'),
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#9C4A3C';
      case 'High': return '#e74c3c';
      case 'Medium': return '#f39c12';
      case 'Low': return '#27ae60';
      default: return '#7f8c8d';
    }
  };

  return (
    <div className="dashboard-grid" style={{ maxWidth: '1400px', margin: '2rem auto' }}>
      {/* Page Header */}
      <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
        <div className="card-header">
          <h3>Operations Dashboard</h3>
          <span className="card-badge">Unified Management</span>
        </div>
        <div className="card-content">
          <p>Manage incidents, work orders, and vendor contacts in one place.</p>
        </div>
      </div>

      {/* Section 1: Incident Log */}
      <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
        <div className="card-header">
          <h4>Incident Log</h4>
          <span className="card-badge warning">Real‑Time</span>
        </div>
        <div className="card-content">
          <form onSubmit={handleAddIncident} style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={incidentTitle}
                onChange={(e) => setIncidentTitle(e.target.value)}
                required
                placeholder="Brief title of the incident"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
                required
                placeholder="Detailed description"
                rows="3"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '1rem' }}
              />
            </div>
            <div className="form-group">
              <label>Severity (1‑5)</label>
              <select
                value={incidentSeverity}
                onChange={(e) => setIncidentSeverity(e.target.value)}
                required
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} – {num === 5 ? 'Critical' : num === 4 ? 'High' : 'Normal'}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={incidentLocation}
                onChange={(e) => setIncidentLocation(e.target.value)}
                required
                placeholder="e.g., Floor 15, Parking B2"
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={incidentLoading}
              style={{ backgroundColor: '#40E0D0', borderColor: '#40E0D0' }}
            >
              {incidentLoading ? 'Adding...' : 'Add Incident'}
            </button>
          </form>

          <h5 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Recent Incidents</h5>
          <table className="rent-roll-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Severity</th>
                <th>Location</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {incidents.length > 0 ? (
                incidents.map(incident => (
                  <tr
                    key={incident.id}
                    style={incident.severity >= 4 ? { borderLeft: `4px solid #9C4A3C` } : {}}
                  >
                    <td><strong>{incident.title}</strong></td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        backgroundColor: incident.severity >= 4 ? '#9C4A3C' : '#40E0D0',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                      }}>
                        {incident.severity}
                      </span>
                    </td>
                    <td>{incident.location}</td>
                    <td>{incident.status}</td>
                    <td>{new Date(incident.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                    No incidents logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Work Order Board */}
      <div className="dashboard-card" style={{ gridColumn: 'span 2' }}>
        <div className="card-header">
          <h4>Work Order Board</h4>
          <span className="card-badge">Kanban</span>
        </div>
        <div className="card-content">
          <form onSubmit={handleAddWorkOrder} style={{ marginBottom: '2rem' }}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={workOrderTitle}
                onChange={(e) => setWorkOrderTitle(e.target.value)}
                required
                placeholder="Work order title"
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={workOrderDescription}
                onChange={(e) => setWorkOrderDescription(e.target.value)}
                required
                placeholder="Describe the work needed"
                rows="2"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '1rem' }}
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={workOrderPriority}
                onChange={(e) => setWorkOrderPriority(e.target.value)}
                required
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div className="form-group">
              <label>Assigned Vendor</label>
              <input
                type="text"
                value={workOrderVendor}
                onChange={(e) => setWorkOrderVendor(e.target.value)}
                required
                placeholder="Vendor name"
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={workOrderLoading}
              style={{ backgroundColor: '#40E0D0', borderColor: '#40E0D0' }}
            >
              {workOrderLoading ? 'Adding...' : 'Create Work Order'}
            </button>
          </form>

          <h5 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Work Order Board</h5>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            {Object.entries(groupedWorkOrders).map(([status, orders]) => (
              <div
                key={status}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '1rem',
                  border: '1px solid #e2e8f0',
                }}
              >
                <h6 style={{ marginBottom: '0.75rem', color: '#2c3e50', textAlign: 'center' }}>
                  {status} ({orders.length})
                </h6>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {orders.map(order => (
                    <div
                      key={order.id}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        padding: '0.75rem',
                        borderLeft: `4px solid ${priorityColor(order.priority)}`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        const nextStatus = {
                          'Open': 'Assigned',
                          'Assigned': 'In Progress',
                          'In Progress': 'Completed',
                          'Completed': 'Open',
                        }[order.status];
                        updateWorkOrderStatus(order.id, nextStatus);
                      }}
                    >
                      <strong>{order.title}</strong>
                      <p style={{ fontSize: '0.85rem', margin: '0.25rem 0', color: '#555' }}>
                        {order.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: priorityColor(order.priority), fontWeight: '600' }}>
                          {order.priority}
                        </span>
                        <span>{order.assigned_vendor}</span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '0.9rem', padding: '1rem' }}>
                      No work orders
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Vendor Contacts */}
      <div className="dashboard-card" style={{ gridColumn: '1 / -1' }}>
        <div className="card-header">
          <h4>Vendor Contacts</h4>
          <span className="card-badge">Key Partners</span>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {vendorContacts.map(vendor => (
              <div
                key={vendor.type}
                style={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s',
                }}
              >
                <h5 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>{vendor.type}</h5>
                <p style={{ color: '#4a5568', fontSize: '0.95rem' }}>{vendor.contact}</p>
                <button
                  className="btn-primary"
                  style={{
                    marginTop: '1rem',
                    backgroundColor: '#40E0D0',
                    borderColor: '#40E0D0',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                  }}
                  onClick={() => alert(`Calling ${vendor.contact}`)}
                >
                  Contact
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Operations;