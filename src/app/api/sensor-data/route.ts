import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      // Return mock data if Supabase not configured
      return NextResponse.json({
        sensors: [
          { sensor: { sensor_type: 'temperature' }, reading: { value: 78 } },
          { sensor: { sensor_type: 'moisture' }, reading: { value: 65 } },
          { sensor: { sensor_type: 'ph' }, reading: { value: 5.2 } }
        ],
        alerts: [],
        timestamp: new Date().toISOString()
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get sensor data
    const { data: sensors, error } = await supabase
      .from('farm_sensors')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    // Get readings for each sensor
    const readings = await Promise.all(
      (sensors || []).map(async (sensor) => {
        const { data } = await supabase
          .from('sensor_readings')
          .select('*')
          .eq('sensor_id', sensor.id)
          .order('reading_time', { ascending: false })
          .limit(1)
          .single();

        return { sensor, reading: data };
      })
    );

    // Get alerts
    const { data: alerts } = await supabase
      .from('farm_alerts')
      .select('*')
      .eq('alert_type', 'security')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      sensors: readings,
      alerts: alerts || [],
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Sensor data error:', error);
    
    // Return mock data on error
    return NextResponse.json({
      sensors: [
        { sensor: { sensor_type: 'temperature' }, reading: { value: 78 } },
        { sensor: { sensor_type: 'moisture' }, reading: { value: 65 } },
        { sensor: { sensor_type: 'ph' }, reading: { value: 5.2 } }
      ],
      alerts: [],
      timestamp: new Date().toISOString()
    });
  }
}
