const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listTables() {
  // Supabase doesn't have a direct "list tables" API via JS.
  // We'll try to query each known table and see if they exist.
  const knownTables = [
    'tenants',
    'units',
    'leases',
    'lease_charges',
    'work_orders',
    'incidents',
    'ai_actions',
    'vendor_contracts',
    'expenses',
    'property_valuations'
  ];

  for (const table of knownTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(2);
      
      if (error) {
        console.log(`Table ${table}: NOT FOUND or error - ${error.message}`);
      } else {
        console.log(`Table ${table}: FOUND, ${data.length} sample rows`);
        if (data.length > 0) {
          console.log('  Sample:', JSON.stringify(data[0], null, 2));
        }
        // Check column presence for critical columns
        if (table === 'lease_charges') {
          const { data: sample } = await supabase
            .from(table)
            .select('escalation_rate')
            .limit(1);
          console.log(`  Has escalation_rate? ${sample && sample.length > 0 ? 'Yes' : 'No'}`);
        }
        if (table === 'incidents') {
          const { data: sample } = await supabase
            .from(table)
            .select('severity')
            .limit(1);
          console.log(`  Has severity? ${sample && sample.length > 0 ? 'Yes' : 'No'}`);
        }
      }
    } catch (err) {
      console.log(`Table ${table}: ERROR - ${err.message}`);
    }
  }
}

listTables().then(() => {
  console.log('Audit complete.');
}).catch(err => {
  console.error('Audit failed:', err);
});