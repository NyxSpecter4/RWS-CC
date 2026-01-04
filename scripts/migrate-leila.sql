-- Leila Farm Management Database Migration
-- This SQL script sets up the core tables for Leila's farm management system
-- Adapted from commercial real estate schema to farm operations

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== CORE FARM TABLES ====================

-- Farm locations/plots
CREATE TABLE IF NOT EXISTS farm_plots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255),
  area_hectares DECIMAL(10,2),
  soil_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crop cycles (planting to harvest)
CREATE TABLE IF NOT EXISTS crop_cycles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plot_id UUID REFERENCES farm_plots(id) ON DELETE CASCADE,
  crop_type VARCHAR(100) NOT NULL,
  variety VARCHAR(100),
  planting_date DATE NOT NULL,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  status VARCHAR(50) DEFAULT 'growing', -- planned, growing, harvested, failed
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Farm sensors (IoT devices)
CREATE TABLE IF NOT EXISTS farm_sensors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plot_id UUID REFERENCES farm_plots(id) ON DELETE CASCADE,
  sensor_type VARCHAR(50) NOT NULL, -- temperature, humidity, soil_moisture, etc.
  device_id VARCHAR(100) UNIQUE NOT NULL,
  location_description TEXT,
  last_read TIMESTAMP WITH TIME ZONE,
  battery_level INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sensor readings
CREATE TABLE IF NOT EXISTS sensor_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sensor_id UUID REFERENCES farm_sensors(id) ON DELETE CASCADE,
  value DECIMAL(10,4) NOT NULL,
  unit VARCHAR(20),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Farm equipment
CREATE TABLE IF NOT EXISTS farm_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50), -- tractor, harvester, irrigation, etc.
  model VARCHAR(100),
  purchase_date DATE,
  last_service DATE,
  total_hours INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active', -- active, maintenance, retired
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Farm supplies inventory
CREATE TABLE IF NOT EXISTS farm_supplies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50), -- seeds, fertilizer, pesticides, tools
  current_quantity DECIMAL(10,2) DEFAULT 0,
  minimum_quantity DECIMAL(10,2) DEFAULT 10,
  unit VARCHAR(20) NOT NULL, -- kg, liters, units, etc.
  last_restock DATE,
  supplier VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== ALERT SYSTEM (from previous systems) ====================

-- Farm alerts (adapted from previous alert systems)
CREATE TABLE IF NOT EXISTS farm_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL, -- crop_health, weather_alert, equipment_maintenance, etc.
  severity VARCHAR(20) NOT NULL, -- low, medium, high, critical
  title VARCHAR(200) NOT NULL,
  description TEXT,
  entity_type VARCHAR(50), -- crop, equipment, supply, sensor
  entity_id UUID, -- reference to the entity
  metadata JSONB,
  status VARCHAR(20) DEFAULT 'new', -- new, acknowledged, resolved, dismissed
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== WEATHER DATA ====================

-- Weather data (could be from external API)
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plot_id UUID REFERENCES farm_plots(id) ON DELETE CASCADE,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  precipitation DECIMAL(5,2),
  wind_speed DECIMAL(5,2),
  forecast_date DATE NOT NULL,
  source VARCHAR(50), -- api, manual, sensor
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== TASKS & WORK ORDERS ====================

-- Farm tasks (adapted from previous work orders)
CREATE TABLE IF NOT EXISTS farm_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  plot_id UUID REFERENCES farm_plots(id) ON DELETE SET NULL,
  assigned_to VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
  status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, cancelled
  due_date DATE,
  completed_date DATE,
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  category VARCHAR(50), -- planting, harvesting, maintenance, inspection
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== FINANCIAL RECORDS ====================

-- Farm expenses (adapted from previous expenses)
CREATE TABLE IF NOT EXISTS farm_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  category VARCHAR(50) NOT NULL, -- seeds, fertilizer, labor, equipment, utilities
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  plot_id UUID REFERENCES farm_plots(id) ON DELETE SET NULL,
  supplier VARCHAR(100),
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Farm sales/produce
CREATE TABLE IF NOT EXISTS farm_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  crop_type VARCHAR(100),
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  price_per_unit DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) GENERATED ALWAYS AS (quantity * price_per_unit) STORED,
  buyer VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================== INDEXES ====================

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crop_cycles_plot_id ON crop_cycles(plot_id);
CREATE INDEX IF NOT EXISTS idx_crop_cycles_status ON crop_cycles(status);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp);
CREATE INDEX IF NOT EXISTS idx_farm_alerts_status ON farm_alerts(status);
CREATE INDEX IF NOT EXISTS idx_farm_alerts_detected_at ON farm_alerts(detected_at);
CREATE INDEX IF NOT EXISTS idx_farm_tasks_status ON farm_tasks(status);
CREATE INDEX IF NOT EXISTS idx_farm_tasks_due_date ON farm_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_weather_data_plot_id ON weather_data(plot_id);
CREATE INDEX IF NOT EXISTS idx_weather_data_forecast_date ON weather_data(forecast_date);

-- ==================== FUNCTIONS & TRIGGERS ====================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at column
DO $$ 
DECLARE 
  t text;
BEGIN 
  FOR t IN 
    SELECT table_name FROM information_schema.columns 
    WHERE column_name = 'updated_at' AND table_schema = 'public'
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS update_%s_updated_at ON %I;
      CREATE TRIGGER update_%s_updated_at
      BEFORE UPDATE ON %I
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END;
$$;

-- ==================== SAMPLE DATA ====================

-- Insert sample farm plot
INSERT INTO farm_plots (id, name, location, area_hectares, soil_type) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'North Field', 'Northwest corner of property', 5.2, 'loam'),
  ('22222222-2222-2222-2222-222222222222', 'South Greenhouse', 'Main greenhouse complex', 0.5, 'potting_mix')
ON CONFLICT (id) DO NOTHING;

-- Insert sample crop cycle
INSERT INTO crop_cycles (id, plot_id, crop_type, variety, planting_date, expected_harvest_date, status)
VALUES 
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Tomatoes', 'Heirloom', '2024-03-15', '2024-07-15', 'growing'),
  ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Lettuce', 'Romaine', '2024-04-01', '2024-05-15', 'growing')
ON CONFLICT (id) DO NOTHING;

-- Insert sample supplies
INSERT INTO farm_supplies (id, name, category, current_quantity, minimum_quantity, unit, supplier)
VALUES 
  ('55555555-5555-5555-5555-555555555555', 'Tomato Seeds', 'seeds', 2.5, 1.0, 'kg', 'SeedCo'),
  ('66666666-6666-6666-6666-666666666666', 'Organic Fertilizer', 'fertilizer', 50, 20, 'kg', 'EcoGrow'),
  ('77777777-7777-7777-7777-777777777777', 'Drip Irrigation Tubing', 'tools', 100, 50, 'meters', 'FarmSupply Inc.')
ON CONFLICT (id) DO NOTHING;

-- ==================== COMMENTS ====================

COMMENT ON TABLE farm_plots IS 'Physical farm locations/plots of land';
COMMENT ON TABLE crop_cycles IS 'Crop planting to harvest cycles';
COMMENT ON TABLE farm_sensors IS 'IoT sensors deployed across the farm';
COMMENT ON TABLE sensor_readings IS 'Time-series data from farm sensors';
COMMENT ON TABLE farm_equipment IS 'Farm machinery and equipment';
COMMENT ON TABLE farm_supplies IS 'Inventory of farm supplies and materials';
COMMENT ON TABLE farm_alerts IS 'Alert system for farm issues (adapted from previous systems)';
COMMENT ON TABLE weather_data IS 'Weather observations and forecasts';
COMMENT ON TABLE farm_tasks IS 'Work tasks and assignments (adapted from previous work orders)';
COMMENT ON TABLE farm_expenses IS 'Farm operational expenses';
COMMENT ON TABLE farm_sales IS 'Sales of farm produce';

-- ==================== MIGRATION COMPLETE ====================

SELECT 'Leila Farm Database Migration Complete' AS message;