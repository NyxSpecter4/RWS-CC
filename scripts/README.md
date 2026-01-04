# Leila Database Migration

This directory contains migration scripts for setting up Leila's farm management database, adapted from commercial real estate systems.

## Files

- `migrate-leila.sql` - Complete SQL migration script
- `migrate.ts` - TypeScript utility to run migrations (requires manual SQL execution)
- `README.md` - This file

## Database Schema Overview

The migration adapts commercial real estate schema to farm operations:

### Core Farm Tables
- `farm_plots` - Physical farm locations/plots
- `crop_cycles` - Crop planting to harvest cycles
- `farm_sensors` - IoT sensors across the farm
- `sensor_readings` - Time-series sensor data
- `farm_equipment` - Farm machinery and equipment
- `farm_supplies` - Inventory of farm supplies

### Alert System (Adapted from previous systems)
- `farm_alerts` - Alert system for farm issues with types: crop_health, weather_alert, equipment_maintenance, etc.

### Operational Tables
- `weather_data` - Weather observations and forecasts
- `farm_tasks` - Work tasks and assignments
- `farm_expenses` - Farm operational expenses
- `farm_sales` - Sales of farm produce

## How to Run the Migration

### Option 1: Direct SQL Execution (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `migrate-leila.sql`
4. Run the SQL script

### Option 2: Using the TypeScript Utility
1. Ensure you have the required environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional, for full access)
   ```

2. Install dependencies if needed:
   ```bash
   npm install @supabase/supabase-js
   ```

3. Run the migration:
   ```bash
   npx tsx scripts/migrate.ts
   ```

   Note: The TypeScript utility has limited SQL execution capabilities due to Supabase JS client restrictions. It's mainly for validation.

## Migration Features

- **UUID primary keys** for all tables
- **Automatic timestamps** (`created_at`, `updated_at`)
- **Sample data** for testing
- **Indexes** for performance
- **Triggers** for automatic `updated_at` updates
- **Conflict handling** for sample data

## Post-Migration Steps

1. **Verify the migration**: Check that all tables were created successfully
2. **Test the alert system**: Run `runFarmAlertDetection()` from `src/lib/leila-brain.ts`
3. **Configure environment**: Update `.env.local` with your Supabase credentials
4. **Test API endpoints**: Verify `/api/ai/process` works correctly

## Notes

- The migration preserves the core alert detection logic from previous systems but adapts it for farm management
- Sample data is included for testing purposes
- All tables include proper foreign key relationships
- The schema is designed to be extensible for future farm management features