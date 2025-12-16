import { supabase } from './supabaseClient';

/**
 * AI Alert & Action System - Detection Engine
 * 
 * This module contains functions to detect various types of alerts
 * based on rule-based and AI-powered analysis.
 */

// Alert types
export const ALERT_TYPES = {
  LEASE_EXPIRATION: 'lease_expiration',
  FINANCIAL_ANOMALY: 'financial_anomaly',
  MAINTENANCE_URGENT: 'maintenance_urgent',
  SECURITY_INCIDENT: 'security_incident',
  COMPLIANCE_VIOLATION: 'compliance_violation',
  REVENUE_DROP: 'revenue_drop',
  EXPENSE_SPIKE: 'expense_spike',
  TENANT_AT_RISK: 'tenant_at_risk',
};

// Severity levels
export const SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

/**
 * Detect lease expiration alerts
 * Finds leases expiring within the next 30 days
 */
export async function detectLeaseExpirationAlerts() {
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const nextMonthStr = nextMonth.toISOString().split('T')[0];

  const { data: leases, error } = await supabase
    .from('leases')
    .select('id, end_date, tenant_id, unit_id, base_rent')
    .lte('end_date', nextMonthStr)
    .gte('end_date', today)
    .order('end_date', { ascending: true });

  if (error) {
    console.error('Error fetching leases for expiration detection:', error);
    return [];
  }

  const alerts = [];
  for (const lease of leases) {
    const daysUntilExpiry = Math.ceil((new Date(lease.end_date) - new Date()) / (1000 * 60 * 60 * 24));
    let severity = SEVERITY.LOW;
    if (daysUntilExpiry <= 7) severity = SEVERITY.CRITICAL;
    else if (daysUntilExpiry <= 14) severity = SEVERITY.HIGH;
    else if (daysUntilExpiry <= 21) severity = SEVERITY.MEDIUM;

    alerts.push({
      type: ALERT_TYPES.LEASE_EXPIRATION,
      severity,
      title: `Lease Expiring in ${daysUntilExpiry} days`,
      description: `Lease for unit ${lease.unit_id} expires on ${lease.end_date}.`,
      entity_type: 'lease',
      entity_id: lease.id,
      metadata: {
        end_date: lease.end_date,
        days_until_expiry: daysUntilExpiry,
        base_rent: lease.base_rent,
      },
      detected_at: new Date().toISOString(),
    });
  }

  return alerts;
}

/**
 * Detect financial anomalies by comparing current month expenses vs historical average
 * This is a simplified rule-based detection
 */
export async function detectFinancialAnomalies() {
  // Get current month expenses
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  const { data: currentExpenses, error } = await supabase
    .from('expenses')
    .select('amount, category')
    .gte('date', currentMonthStart)
    .lte('date', currentMonthEnd);

  if (error) {
    console.error('Error fetching expenses for anomaly detection:', error);
    return [];
  }

  const totalCurrent = currentExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  
  // Simplified: if current month expenses > 150% of last month's average, flag
  // In a real system, we'd compute historical average
  const threshold = 50000; // placeholder
  if (totalCurrent > threshold * 1.5) {
    return [{
      type: ALERT_TYPES.EXPENSE_SPIKE,
      severity: SEVERITY.HIGH,
      title: 'Unusual Expense Spike Detected',
      description: `Current month expenses ($${totalCurrent.toLocaleString()}) are 50% above expected threshold.`,
      entity_type: 'financial',
      entity_id: null,
      metadata: {
        current_amount: totalCurrent,
        threshold,
        percentage_increase: ((totalCurrent - threshold) / threshold * 100).toFixed(1),
      },
      detected_at: new Date().toISOString(),
    }];
  }

  return [];
}

/**
 * Detect urgent maintenance issues (work orders overdue > 7 days)
 */
export async function detectMaintenanceAlerts() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  const { data: workOrders, error } = await supabase
    .from('work_orders')
    .select('id, title, created_at, priority, status')
    .eq('status', 'open')
    .lte('created_at', weekAgoStr);

  if (error) {
    console.error('Error fetching work orders for maintenance detection:', error);
    return [];
  }

  const alerts = [];
  for (const wo of workOrders) {
    const daysOverdue = Math.ceil((new Date() - new Date(wo.created_at)) / (1000 * 60 * 60 * 24));
    let severity = SEVERITY.MEDIUM;
    if (wo.priority === 'high') severity = SEVERITY.HIGH;
    if (daysOverdue > 14) severity = SEVERITY.CRITICAL;

    alerts.push({
      type: ALERT_TYPES.MAINTENANCE_URGENT,
      severity,
      title: `Overdue Work Order: ${wo.title}`,
      description: `Work order #${wo.id} has been open for ${daysOverdue} days.`,
      entity_type: 'work_order',
      entity_id: wo.id,
      metadata: {
        days_overdue: daysOverdue,
        priority: wo.priority,
        created_at: wo.created_at,
      },
      detected_at: new Date().toISOString(),
    });
  }

  return alerts;
}

/**
 * Detect security incidents (unresolved incidents with high severity)
 */
export async function detectSecurityIncidents() {
  const { data: incidents, error } = await supabase
    .from('incidents')
    .select('id, title, severity, resolved')
    .eq('resolved', false)
    .eq('severity', 'high');

  if (error) {
    console.error('Error fetching incidents for security detection:', error);
    return [];
  }

  return incidents.map(incident => ({
    type: ALERT_TYPES.SECURITY_INCIDENT,
    severity: SEVERITY.HIGH,
    title: `Security Incident: ${incident.title}`,
    description: `Unresolved high-severity incident requires attention.`,
    entity_type: 'incident',
    entity_id: incident.id,
    metadata: {
      severity: incident.severity,
    },
    detected_at: new Date().toISOString(),
  }));
}

/**
 * Run all detection functions and return combined alerts
 */
export async function detectAllAlerts() {
  try {
    const [
      leaseAlerts,
      financialAlerts,
      maintenanceAlerts,
      securityAlerts,
    ] = await Promise.all([
      detectLeaseExpirationAlerts(),
      detectFinancialAnomalies(),
      detectMaintenanceAlerts(),
      detectSecurityIncidents(),
    ]);

    return [
      ...leaseAlerts,
      ...financialAlerts,
      ...maintenanceAlerts,
      ...securityAlerts,
    ];
  } catch (error) {
    console.error('Error in detectAllAlerts:', error);
    return [];
  }
}

/**
 * Save alerts to the database (alerts table)
 */
export async function saveAlerts(alerts) {
  if (!alerts || alerts.length === 0) return [];

  const { data, error } = await supabase
    .from('alerts')
    .insert(
      alerts.map(alert => ({
        ...alert,
        status: 'new', // new, acknowledged, resolved, dismissed
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
    )
    .select();

  if (error) {
    console.error('Error saving alerts:', error);
    return [];
  }

  return data;
}

/**
 * Main function to run detection and save alerts
 */
export async function runAlertDetection() {
  console.log('Running AI Alert Detection...');
  const alerts = await detectAllAlerts();
  console.log(`Detected ${alerts.length} alerts`);
  
  if (alerts.length > 0) {
    const saved = await saveAlerts(alerts);
    console.log(`Saved ${saved.length} alerts to database`);
    return saved;
  }
  
  return [];
}