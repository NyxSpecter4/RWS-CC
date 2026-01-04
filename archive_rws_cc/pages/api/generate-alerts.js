import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use service role key for inserting alerts
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Calculate date range: today and 90 days from today
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 90);
    const todayStr = today.toISOString().split('T')[0];
    const futureStr = future.toISOString().split('T')[0];

    // Query leases where end_date is within the next 90 days
    const { data: leases, error: leaseError } = await supabase
      .from('leases')
      .select('id, end_date, tenant_id, unit_id, base_rent')
      .gte('end_date', todayStr)
      .lte('end_date', futureStr)
      .order('end_date', { ascending: true });

    if (leaseError) {
      console.error('Error fetching leases:', leaseError);
      return res.status(500).json({ error: 'Failed to fetch leases', details: leaseError.message });
    }

    if (!leases || leases.length === 0) {
      return res.status(200).json({ generated: 0 });
    }

    // Prepare alerts for insertion
    const alerts = leases.map(lease => {
      const daysUntil = Math.ceil((new Date(lease.end_date) - today) / (1000 * 60 * 60 * 24));
      return {
        alert_type: 'lease',
        priority: 'medium',
        title: `Lease Expiring in ${daysUntil} days`,
        description: `Lease for unit ${lease.unit_id} (tenant ${lease.tenant_id}) expires on ${lease.end_date}. Base rent: $${lease.base_rent}`,
        status: 'new',
        related_entity_id: lease.id,
        metadata: {
          end_date: lease.end_date,
          days_until_expiry: daysUntil,
          base_rent: lease.base_rent,
          tenant_id: lease.tenant_id,
          unit_id: lease.unit_id,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    // Insert into ai_alerts table
    const { error: insertError } = await supabase
      .from('ai_alerts')
      .insert(alerts);

    if (insertError) {
      console.error('Error inserting alerts:', insertError);
      return res.status(500).json({ error: 'Failed to insert alerts', details: insertError.message });
    }

    return res.status(200).json({ generated: alerts.length });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}