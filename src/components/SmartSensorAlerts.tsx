'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, Droplets, Zap, ThermometerSun } from 'lucide-react';

interface SensorReading {
  sensor_type: string;
  value: number;
  depth_cm?: number;
  location: string;
  last_reading: string;
}

interface SmartAlert {
  level: 'URGENT' | 'HIGH' | 'MEDIUM';
  icon: any;
  message: string;
  action: string;
  timing: string;
  sensor: string;
  color: string;
}

export default function SmartSensorAlerts() {
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);

  useEffect(() => {
    loadSensorData();
    const interval = setInterval(loadSensorData, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSensorData = async () => {
    try {
      const res = await fetch('/api/sensor-data');
      const data = await res.json();
      
      // Simulate Teros 12 EC sensors at different depths
      const mockSensors: SensorReading[] = [
        { sensor_type: 'moisture', value: 45, depth_cm: 10, location: 'Māmaki Plot 3', last_reading: new Date().toISOString() },
        { sensor_type: 'moisture', value: 52, depth_cm: 30, location: 'Māmaki Plot 3', last_reading: new Date().toISOString() },
        { sensor_type: 'moisture', value: 58, depth_cm: 60, location: 'Māmaki Plot 3', last_reading: new Date().toISOString() },
        { sensor_type: 'moisture', value: 61, depth_cm: 90, location: 'Māmaki Plot 3', last_reading: new Date().toISOString() },
        { sensor_type: 'ec', value: 1.2, depth_cm: 10, location: 'Māmaki Plot 3', last_reading: new Date().toISOString() },
        { sensor_type: 'ec', value: 1.8, depth_cm: 30, location: 'Māmaki Plot 3', last_reading: new Date().toISOString() },
        { sensor_type: 'ec', value: 2.1, depth_cm: 60, location: 'Māmaki Plot 3', last_reading: new Date().toISOString() },
        { sensor_type: 'ec', value: 2.4, depth_cm: 90, location: 'Māmaki Plot 3', last_reading: new Date().toISOString() },
        { sensor_type: 'temperature', value: 78, location: 'Māmaki Plot 3', last_reading: new Date().toISOString() },
      ];
      
      setSensors(mockSensors);
      generateSmartAlerts(mockSensors);
    } catch (e) {
      console.error('Sensor data error:', e);
    }
  };

  const generateSmartAlerts = (sensorData: SensorReading[]) => {
    const newAlerts: SmartAlert[] = [];

    // SMART IRRIGATION LOGIC
    sensorData.forEach(s => {
      if (s.sensor_type === 'moisture' && s.depth_cm === 10) {
        if (s.value < 50) {
          newAlerts.push({
            level: 'URGENT',
            icon: Droplets,
            message: `Moisture at ${s.value}% (10cm depth) - CRITICALLY LOW`,
            action: `IRRIGATE ${s.location} NOW`,
            timing: 'Immediate - preferably during Kū phase (tomorrow 6am for upward growth)',
            sensor: `Teros 12 @ 10cm`,
            color: 'red'
          });
        }
      }

      // EC (ELECTRICAL CONDUCTIVITY) ALERTS - Critical for volcanic soil
      if (s.sensor_type === 'ec' && s.depth_cm === 30) {
        if (s.value < 1.5) {
          newAlerts.push({
            level: 'HIGH',
            icon: Zap,
            message: `EC at ${s.value} mS/cm (30cm) - Nutrient availability LOW`,
            action: `Apply Guava-Tip FPJ diluted 2 tsp/gallon`,
            timing: 'Within 24 hours - nutrient deficiency developing',
            sensor: `Teros 12 EC @ 30cm`,
            color: 'orange'
          });
        }
        if (s.value > 3.0) {
          newAlerts.push({
            level: 'HIGH',
            icon: Zap,
            message: `EC at ${s.value} mS/cm (30cm) - Salt buildup detected`,
            action: `Flush with rainwater - reduce fertilizer applications`,
            timing: 'Next rainfall or manual flush within 2 days',
            sensor: `Teros 12 EC @ 30cm`,
            color: 'orange'
          });
        }
      }

      // TEMPERATURE ALERTS
      if (s.sensor_type === 'temperature') {
        if (s.value > 85) {
          newAlerts.push({
            level: 'MEDIUM',
            icon: ThermometerSun,
            message: `Soil temperature ${s.value}°F - Heat stress risk`,
            action: `Add mulch layer, increase irrigation frequency`,
            timing: 'Today - before afternoon sun',
            sensor: `Temp sensor`,
            color: 'yellow'
          });
        }
      }
    });

    setAlerts(newAlerts);
  };

  const recommendedSensors = [
    {
      name: 'METER Teros 12',
      specs: 'Soil moisture, EC, temperature',
      depth: '10cm, 30cm, 60cm, 90cm',
      price: '$89/sensor',
      roi: '3 months',
      why: 'Proven in Hawaii coffee farms, 95% accuracy in high rainfall'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-10 h-10 text-cyan-400" />
          <div>
            <h2 className="text-3xl font-bold text-[#FFE573]">📡 Smart Sensor Intelligence</h2>
            <p className="text-white/80">Real-time alerts transform sensors into farm advisors</p>
          </div>
        </div>

        {/* ACTIVE ALERTS */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-4">
            <h3 className="text-2xl font-bold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              ACTIVE ALERTS ({alerts.length})
            </h3>
            
            {alerts.map((alert, i) => {
              const Icon = alert.icon;
              return (
                <div key={i} className={`bg-${alert.color}-900/30 border-2 border-${alert.color}-500 p-6 rounded-xl`}>
                  <div className="flex items-start gap-4">
                    <Icon className={`w-8 h-8 text-${alert.color}-400 flex-shrink-0 mt-1`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`text-xl font-bold text-${alert.color}-400`}>{alert.level} PRIORITY</h4>
                        <span className="text-xs text-white/60 font-mono">{alert.sensor}</span>
                      </div>
                      
                      <p className="text-white font-semibold text-lg mb-2">{alert.message}</p>
                      
                      <div className="bg-black/40 p-4 rounded-lg mb-3">
                        <p className="text-green-400 font-bold mb-1">✅ RECOMMENDED ACTION:</p>
                        <p className="text-white text-lg">{alert.action}</p>
                      </div>
                      
                      <p className="text-white/60 text-sm">
                        ⏰ Timing: {alert.timing}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SENSOR READINGS - 4 DEPTHS */}
        <div className="bg-black/40 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-4">Teros 12 Multi-Depth Array - Māmaki Plot 3</h3>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[10, 30, 60, 90].map(depth => {
              const moistureSensor = sensors.find(s => s.sensor_type === 'moisture' && s.depth_cm === depth);
              const ecSensor = sensors.find(s => s.sensor_type === 'ec' && s.depth_cm === depth);
              
              return (
                <div key={depth} className="bg-white/10 p-4 rounded-lg border border-cyan-500/30">
                  <p className="text-cyan-400 font-bold text-center mb-3">{depth}cm depth</p>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-white/60">Moisture</p>
                      <p className="text-2xl font-bold text-white">{moistureSensor?.value}%</p>
                      <div className="w-full bg-gray-700 h-2 rounded-full mt-1">
                        <div 
                          className={`h-2 rounded-full ${moistureSensor && moistureSensor.value < 50 ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${moistureSensor?.value}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-white/60">EC (mS/cm)</p>
                      <p className="text-xl font-bold text-cyan-400">{ecSensor?.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-white/60 text-sm text-center">
            Last updated: {new Date().toLocaleTimeString()} • Auto-refresh every 30 seconds
          </p>
        </div>

        {/* RECOMMENDED HARDWARE */}
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 p-6 rounded-xl border border-green-500/30">
          <h3 className="text-2xl font-bold text-green-400 mb-4">🛒 Recommended Sensor Upgrade</h3>
          
          {recommendedSensors.map((sensor, i) => (
            <div key={i} className="bg-black/40 p-5 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-xl font-bold text-white">{sensor.name}</h4>
                  <p className="text-white/70">{sensor.specs}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-bold text-2xl">{sensor.price}</p>
                  <p className="text-xs text-green-400">ROI in {sensor.roi}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-white/60 mb-1">Install depths:</p>
                  <p className="text-white font-semibold">{sensor.depth}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 mb-1">Why this sensor:</p>
                  <p className="text-white/80 text-sm">{sensor.why}</p>
                </div>
              </div>
              
              <button className="mt-4 w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 transition-all">
                Add to Equipment List
              </button>
            </div>
          ))}
        </div>

        {/* IMPLEMENTATION CODE */}
        <details className="mt-6 bg-gray-900 p-4 rounded-lg">
          <summary className="text-blue-400 font-bold cursor-pointer">Show Implementation Code</summary>
          <pre className="text-gray-100 text-sm mt-4 overflow-x-auto">
{`// Smart irrigation logic
const alerts = sensorData.map(s => {
  if (s.type === 'moisture' && s.depth === 10 && s.value < 50) {
    return {
      level: 'URGENT',
      action: 'Irrigate māmaki plot NOW',
      timing: 'During Kū phase (tomorrow 6am)',
      reason: 'Soil moisture at ' + s.value + '%'
    };
  }
  
  if (s.type === 'ec' && s.value < 1.5) {
    return {
      level: 'HIGH',
      action: 'Apply Guava FPJ diluted 2 tsp/gallon',
      timing: 'Within 24 hours',
      reason: 'Nutrient availability low (EC: ' + s.value + ')'
    };
  }
});`}
          </pre>
        </details>
      </div>
    </div>
  );
}
