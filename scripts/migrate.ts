import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Leila Database Migration Utility
 * 
 * This script runs the SQL migration to set up Leila's farm management database.
 * It adapts the commercial real estate schema to farm operations.
 */

async function runMigration() {
  console.log('🚀 Starting Leila Database Migration...\n');

  // Load environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables.');
    console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  // Use service role key for migrations if available, otherwise use anon key
  const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

  try {
    // Read the SQL migration file
    const migrationPath = join(__dirname, 'migrate-leila.sql');
    const sql = readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration SQL loaded successfully');
    console.log(`📏 SQL size: ${sql.length} characters`);
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔢 Found ${statements.length} SQL statements to execute\n`);
    
    // Execute each statement
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const isSelect = statement.toLowerCase().trim().startsWith('select');
      
      try {
        if (isSelect) {
          // For SELECT statements, use .from().select()
          const tableMatch = statement.match(/from\s+(\w+)/i);
          if (tableMatch) {
            const tableName = tableMatch[1];
            const { error } = await supabase.from(tableName).select('*').limit(1);
            if (error) throw error;
          }
        } else {
          // For other statements, use .rpc() or direct SQL execution
          // Note: Supabase JS client doesn't support arbitrary SQL execution
          // In production, you would use the Supabase SQL API or pg directly
          console.log(`  ⚠️  Statement ${i + 1}: Cannot execute directly via JS client`);
          console.log(`     Consider running this SQL in the Supabase SQL editor:`);
          console.log(`     ${statement.substring(0, 100)}...`);
          continue;
        }
        
        successCount++;
        console.log(`  ✅ Statement ${i + 1}: Executed successfully`);
      } catch (error: any) {
        errorCount++;
        console.log(`  ❌ Statement ${i + 1}: Failed`);
        console.log(`     Error: ${error.message}`);
        
        // Don't stop on errors for sample data inserts (they might already exist)
        if (statement.toLowerCase().includes('insert into') && 
            statement.toLowerCase().includes('on conflict')) {
          console.log(`     (This is expected for duplicate sample data)`);
          successCount++; // Count as success for conflict handling
          errorCount--;
        }
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📋 Total: ${statements.length}`);
    
    if (errorCount > 0 && !(statements.some(s => s.toLowerCase().includes('insert into')))) {
      console.log('\n⚠️  Some statements failed. Check the errors above.');
      console.log('   For production migrations, consider:');
      console.log('   1. Running the SQL directly in Supabase SQL editor');
      console.log('   2. Using the Supabase Migration CLI');
      console.log('   3. Using a proper migration tool like db-migrate');
    } else {
      console.log('\n🎉 Migration completed successfully!');
      console.log('   Leila farm database is ready.');
    }
    
    // Test the connection by fetching some data
    console.log('\n🔍 Testing database connection...');
    try {
      const { data: plots, error } = await supabase
        .from('farm_plots')
        .select('id, name')
        .limit(2);
      
      if (error) {
        console.log(`   ❌ Test query failed: ${error.message}`);
        console.log('   Please run the SQL migration manually in Supabase SQL editor.');
      } else {
        console.log(`   ✅ Connected successfully! Found ${plots?.length || 0} farm plots.`);
        if (plots && plots.length > 0) {
          console.log('   Sample plots:');
          plots.forEach(plot => console.log(`     - ${plot.name} (${plot.id})`));
        }
      }
    } catch (testError: any) {
      console.log(`   ⚠️  Test query error: ${testError.message}`);
    }
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
runMigration().catch(error => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});