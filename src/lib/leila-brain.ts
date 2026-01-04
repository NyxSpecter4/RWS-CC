import { supabase } from './supabase';

/**
 * Leila's Brain - AI Alert & Action System for Farm Management
 * 
 * Adapted from farm management alert detector, now focused on farm operations:
 * - Crop health monitoring
 * - Weather alerts
 * - Equipment maintenance
 * - Supply chain issues
 * - Financial anomalies for farm operations
 */

// Alert types for farm management with Hawaiian Acres specific alerts
export const ALERT_TYPES = {
  CROP_HEALTH: 'crop_health',
  WEATHER_ALERT: 'weather_alert',
  EQUIPMENT_MAINTENANCE: 'equipment_maintenance',
  SUPPLY_SHORTAGE: 'supply_shortage',
  FINANCIAL_ANOMALY: 'financial_anomaly',
  PEST_DETECTION: 'pest_detection',
  IRRIGATION_ISSUE: 'irrigation_issue',
  HARVEST_TIMING: 'harvest_timing',
  // Hawaiian Acres specific alerts
  LAVENDER_ROOT_ROT: 'lavender_root_rot',
  HYDROPONIC_DILUTION: 'hydroponic_dilution',
  HAWAIIAN_PEST: 'hawaiian_pest',
  MOON_PHASE_ALERT: 'moon_phase_alert',
  // Bio-Prophet IoT sensor alerts
  SOIL_SATURATION: 'soil_saturation',
  EC_LOW: 'ec_low',
};

// Severity levels
export const SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

// Alert interface
export interface FarmAlert {
  id?: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  entity_type: string;
  entity_id: string | number | null;
  metadata: Record<string, any>;
  detected_at: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
}

/**
 * Detect crop health issues based on sensor data
 * Monitors moisture, temperature, and growth metrics
 */
export async function detectCropHealthAlerts(): Promise<FarmAlert[]> {
  try {
    // Get recent sensor data for crops
    const { data: sensorReadings, error } = await supabase
      .from('farm_sensors')
      .select('id, sensor_type, value, unit, crop_id, timestamp')
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching sensor data for crop health detection:', error);
      return [];
    }

    const alerts: FarmAlert[] = [];
    
    // Group by crop and sensor type
    const cropData = new Map();
    
    sensorReadings?.forEach(reading => {
      if (!cropData.has(reading.crop_id)) {
        cropData.set(reading.crop_id, {});
      }
      const crop = cropData.get(reading.crop_id);
      crop[reading.sensor_type] = reading.value;
    });

    // Check thresholds for each crop
    for (const [cropId, sensors] of cropData.entries()) {
      // Soil moisture check (example thresholds)
      if (sensors.soil_moisture !== undefined) {
        if (sensors.soil_moisture < 20) {
          alerts.push({
            type: ALERT_TYPES.CROP_HEALTH,
            severity: SEVERITY.HIGH,
            title: 'Low Soil Moisture Detected',
            description: `Crop ${cropId} has critically low soil moisture (${sensors.soil_moisture}%).`,
            entity_type: 'crop',
            entity_id: cropId,
            metadata: {
              sensor_type: 'soil_moisture',
              value: sensors.soil_moisture,
              threshold: 20,
              unit: '%',
            },
            detected_at: new Date().toISOString(),
          });
        } else if (sensors.soil_moisture < 30) {
          alerts.push({
            type: ALERT_TYPES.CROP_HEALTH,
            severity: SEVERITY.MEDIUM,
            title: 'Moderate Soil Moisture Warning',
            description: `Crop ${cropId} has low soil moisture (${sensors.soil_moisture}%). Consider irrigation.`,
            entity_type: 'crop',
            entity_id: cropId,
            metadata: {
              sensor_type: 'soil_moisture',
              value: sensors.soil_moisture,
              threshold: 30,
              unit: '%',
            },
            detected_at: new Date().toISOString(),
          });
        } else if (sensors.soil_moisture > 45) {
          // Bio-Prophet Oracle Alert: Soil saturation
          alerts.push({
            type: ALERT_TYPES.SOIL_SATURATION,
            severity: SEVERITY.MEDIUM,
            title: 'Soil Saturation Alert',
            description: `Kahu, the 'aina is saturated (${sensors.soil_moisture}%). Let the roots drink what the sky has provided.`,
            entity_type: 'crop',
            entity_id: cropId,
            metadata: {
              sensor_type: 'soil_moisture',
              value: sensors.soil_moisture,
              threshold: 45,
              unit: '%',
              oracle_message: "Kahu, the 'aina is saturated. Let the roots drink what the sky has provided."
            },
            detected_at: new Date().toISOString(),
          });
        }
      }

      // Electrical Conductivity (EC) check for nutrient strength
      if (sensors.ec !== undefined || sensors.electrical_conductivity !== undefined) {
        const ecValue = sensors.ec !== undefined ? sensors.ec : sensors.electrical_conductivity;
        // Threshold for low EC (nutrient deficiency)
        if (ecValue < 1.0) {
          alerts.push({
            type: ALERT_TYPES.EC_LOW,
            severity: SEVERITY.HIGH,
            title: 'Low Nutrient Strength (EC)',
            description: `Crop ${cropId} has low electrical conductivity (${ecValue} mS/cm). Suggest a Guava-Tip FPJ drench.`,
            entity_type: 'crop',
            entity_id: cropId,
            metadata: {
              sensor_type: 'ec',
              value: ecValue,
              threshold: 1.0,
              unit: 'mS/cm',
              recommendation: 'Apply Guava-Tip FPJ diluted 1:1000 with rainwater as a soil drench.'
            },
            detected_at: new Date().toISOString(),
          });
        }
      }

      // Temperature check
      if (sensors.temperature !== undefined) {
        if (sensors.temperature > 35) {
          alerts.push({
            type: ALERT_TYPES.CROP_HEALTH,
            severity: SEVERITY.HIGH,
            title: 'High Temperature Stress',
            description: `Crop ${cropId} is experiencing high temperature (${sensors.temperature}°C).`,
            entity_type: 'crop',
            entity_id: cropId,
            metadata: {
              sensor_type: 'temperature',
              value: sensors.temperature,
              threshold: 35,
              unit: '°C',
            },
            detected_at: new Date().toISOString(),
          });
        }
      }
    }

    return alerts;
  } catch (error) {
    console.error('Error in detectCropHealthAlerts:', error);
    return [];
  }
}

/**
 * Detect equipment maintenance needs
 * Based on usage hours, last service, and error reports
 */
export async function detectEquipmentAlerts(): Promise<FarmAlert[]> {
  try {
    const { data: equipment, error } = await supabase
      .from('farm_equipment')
      .select('id, name, last_service, total_hours, status')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching equipment data:', error);
      return [];
    }

    const alerts: FarmAlert[] = [];
    const now = new Date();

    equipment?.forEach(item => {
      // Check if overdue for service (assuming 6-month service interval)
      if (item.last_service) {
        const lastService = new Date(item.last_service);
        const monthsSinceService = (now.getTime() - lastService.getTime()) / (1000 * 60 * 60 * 24 * 30);
        
        if (monthsSinceService > 6) {
          alerts.push({
            type: ALERT_TYPES.EQUIPMENT_MAINTENANCE,
            severity: monthsSinceService > 9 ? SEVERITY.CRITICAL : SEVERITY.HIGH,
            title: `Equipment Service Overdue: ${item.name}`,
            description: `${item.name} hasn't been serviced in ${Math.floor(monthsSinceService)} months.`,
            entity_type: 'equipment',
            entity_id: item.id,
            metadata: {
              months_since_service: Math.floor(monthsSinceService),
              last_service: item.last_service,
              recommended_interval: 6,
            },
            detected_at: new Date().toISOString(),
          });
        }
      }

      // Check for high usage hours
      if (item.total_hours > 2000) {
        alerts.push({
          type: ALERT_TYPES.EQUIPMENT_MAINTENANCE,
          severity: SEVERITY.MEDIUM,
          title: `High Usage Equipment: ${item.name}`,
          description: `${item.name} has ${item.total_hours} operating hours. Consider inspection.`,
          entity_type: 'equipment',
          entity_id: item.id,
          metadata: {
            total_hours: item.total_hours,
            threshold: 2000,
          },
          detected_at: new Date().toISOString(),
        });
      }
    });

    return alerts;
  } catch (error) {
    console.error('Error in detectEquipmentAlerts:', error);
    return [];
  }
}

/**
 * Detect supply shortages
 * Checks inventory levels against minimum thresholds
 */
export async function detectSupplyAlerts(): Promise<FarmAlert[]> {
  try {
    const { data: supplies, error } = await supabase
      .from('farm_supplies')
      .select('id, name, current_quantity, minimum_quantity, unit');

    if (error) {
      console.error('Error fetching supply data:', error);
      return [];
    }

    const alerts: FarmAlert[] = [];

    supplies?.forEach(supply => {
      // Filter supplies that are below 120% of minimum quantity
      if (supply.current_quantity < supply.minimum_quantity * 1.2) {
        const percentage = (supply.current_quantity / supply.minimum_quantity) * 100;
        let severity = SEVERITY.LOW;
        
        if (supply.current_quantity <= supply.minimum_quantity) {
          severity = SEVERITY.CRITICAL;
        } else if (percentage < 110) {
          severity = SEVERITY.HIGH;
        } else if (percentage < 120) {
          severity = SEVERITY.MEDIUM;
        }

        alerts.push({
          type: ALERT_TYPES.SUPPLY_SHORTAGE,
          severity,
          title: `Supply Alert: ${supply.name}`,
          description: `${supply.name} is at ${supply.current_quantity} ${supply.unit} (minimum: ${supply.minimum_quantity} ${supply.unit}).`,
          entity_type: 'supply',
          entity_id: supply.id,
          metadata: {
            current_quantity: supply.current_quantity,
            minimum_quantity: supply.minimum_quantity,
            unit: supply.unit,
            percentage: Math.round(percentage),
          },
          detected_at: new Date().toISOString(),
        });
      }
    });

    return alerts;
  } catch (error) {
    console.error('Error in detectSupplyAlerts:', error);
    return [];
  }
}

/**
 * Detect Hawaiian Acres specific alerts based on farm logs and conditions
 */
export async function detectHawaiianAcresAlerts(): Promise<FarmAlert[]> {
  try {
    // Get recent farm logs (last 7 days)
    const { data: farmLogs, error } = await supabase
      .from('farm_logs')
      .select('id, content, created_at, log_type')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching farm logs for Hawaiian Acres detection:', error);
      return [];
    }

    const alerts: FarmAlert[] = [];
    const now = new Date();
    const currentMoonPhase = getCurrentMoonPhase(now);

    // Check each log for Hawaiian Acres specific conditions
    farmLogs?.forEach(log => {
      const content = log.content.toLowerCase();
      
      // 1. Lavender Root Rot Alert
      if ((content.includes('yellowing leaves') || content.includes('wet soil')) &&
          (content.includes('lavender') || content.includes('lavandula'))) {
        alerts.push({
          type: ALERT_TYPES.LAVENDER_ROOT_ROT,
          severity: SEVERITY.CRITICAL,
          title: 'Lavender Root Rot Alert',
          description: 'Kahu, the \'aina is too wet for the lavender. Check the drainage mounds immediately.',
          entity_type: 'crop',
          entity_id: 'lavender',
          metadata: {
            log_id: log.id,
            detected_conditions: ['yellowing leaves', 'wet soil'],
            crop: 'lavender',
            recommendation: 'Check 40% cinder mounds for proper drainage. Consider French (dentata) or Spanish (stoechas) varieties.',
            goddess_perspective: 'The French lavender dances with the rain, while the English lavender drowns.'
          },
          detected_at: new Date().toISOString(),
        });
      }

      // 2. Hydroponic Dilution Alert
      if (content.includes('heavy rain') || content.includes('rain dilution') ||
          content.includes('ec') || content.includes('nutrient strength')) {
        alerts.push({
          type: ALERT_TYPES.HYDROPONIC_DILUTION,
          severity: SEVERITY.HIGH,
          title: 'Hydroponic Dilution Alert',
          description: 'Kahu, check the EC of your hydroponic reservoirs. The rain may have diluted the nutrients.',
          entity_type: 'system',
          entity_id: 'hydroponics',
          metadata: {
            log_id: log.id,
            detected_conditions: ['heavy rain', 'nutrient dilution'],
            system: 'hydroponics',
            recommendation: 'Check Electrical Conductivity (EC) after heavy rain. Adjust nutrient concentration for Kratky or Drain-to-Waste systems.',
            goddess_perspective: 'When the sky weeps 150 inches, bring the plants inside the water\'s wisdom.'
          },
          detected_at: new Date().toISOString(),
        });
      }

      // 3. Pest Alert during harvest moon
      if (currentMoonPhase.phase === 'Hoku (Full Moon)' || currentMoonPhase.phase === 'Akua (Full Moon)') {
        if (content.includes('pig') || content.includes('puaʻa') ||
            content.includes('rat') || content.includes('iole') ||
            content.includes('pest') || content.includes('harvest')) {
          alerts.push({
            type: ALERT_TYPES.HAWAIIAN_PEST,
            severity: SEVERITY.MEDIUM,
            title: 'Harvest Moon Pest Alert',
            description: 'Kahu, watch for puaʻa (wild pigs) and \'iole (rats) near the harvest. They feel the moon\'s abundance too.',
            entity_type: 'pest',
            entity_id: 'wildlife',
            metadata: {
              log_id: log.id,
              moon_phase: currentMoonPhase.phase,
              detected_pests: ['wild pigs', 'rats'],
              recommendation: 'Secure harvest areas during full moon. Use fencing and natural deterrents.',
              goddess_perspective: 'The moon\'s abundance calls all creatures. Protect your harvest with vigilance.'
            },
            detected_at: new Date().toISOString(),
          });
        }
      }
    });

    // 4. Moon Phase Alert for agricultural timing
    if (currentMoonPhase.agriculturalAdvice) {
      alerts.push({
        type: ALERT_TYPES.MOON_PHASE_ALERT,
        severity: SEVERITY.LOW,
        title: `Moon Phase: ${currentMoonPhase.phase}`,
        description: currentMoonPhase.agriculturalAdvice,
        entity_type: 'environment',
        entity_id: 'moon',
        metadata: {
          phase: currentMoonPhase.phase,
          date: currentMoonPhase.date,
          wisdom: currentMoonPhase.wisdom,
          recommendation: currentMoonPhase.recommendation || 'Follow the lunar calendar for optimal planting and harvesting.',
          goddess_perspective: 'The moon\'s breath guides the sap\'s flow. Plant with Hoʻonui, harvest with Hoku.'
        },
        detected_at: new Date().toISOString(),
      });
    }

    return alerts;
  } catch (error) {
    console.error('Error in detectHawaiianAcresAlerts:', error);
    return [];
  }
}

/**
 * Get current moon phase information for Hawaiian Acres
 */
function getCurrentMoonPhase(date: Date): {
  phase: string;
  date: string;
  wisdom: string;
  agriculturalAdvice: string;
  recommendation?: string;
} {
  // For January 3, 2026 - Akua (Full Moon)
  // In a real implementation, this would calculate based on lunar calendar
  const currentDate = new Date('2026-01-03');
  
  return {
    phase: 'Akua (Full Moon)',
    date: 'January 3, 2026',
    wisdom: 'The mana of the land is at its peak.',
    agriculturalAdvice: 'Mana is Peak. Best for Harvesting.',
    recommendation: 'Plant crops that bear fruit above ground. Focus on fruiting plants like tomatoes, peppers, and squash.'
  };
}

/**
 * Run all detection functions and return combined alerts
 */
export async function detectAllFarmAlerts(): Promise<FarmAlert[]> {
  try {
    const [
      cropAlerts,
      equipmentAlerts,
      supplyAlerts,
      hawaiianAcresAlerts,
    ] = await Promise.all([
      detectCropHealthAlerts(),
      detectEquipmentAlerts(),
      detectSupplyAlerts(),
      detectHawaiianAcresAlerts(),
    ]);

    return [
      ...cropAlerts,
      ...equipmentAlerts,
      ...supplyAlerts,
      ...hawaiianAcresAlerts,
    ];
  } catch (error) {
    console.error('Error in detectAllFarmAlerts:', error);
    return [];
  }
}

/**
 * Save alerts to the database
 */
export async function saveFarmAlerts(alerts: FarmAlert[]): Promise<any[]> {
  if (!alerts || alerts.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from('farm_alerts')
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
      console.error('Error saving farm alerts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in saveFarmAlerts:', error);
    return [];
  }
}

/**
 * Main function to run detection and save alerts
 */
export async function runFarmAlertDetection(): Promise<any[]> {
  console.log('Running Leila Farm Alert Detection...');
  const alerts = await detectAllFarmAlerts();
  console.log(`Detected ${alerts.length} farm alerts`);
  
  if (alerts.length > 0) {
    const saved = await saveFarmAlerts(alerts);
    console.log(`Saved ${saved.length} alerts to database`);
    return saved;
  }
  
  return [];
}

/**
 * Get recent alerts for display
 */
export async function getRecentAlerts(limit: number = 10): Promise<FarmAlert[]> {
  try {
    const { data, error } = await supabase
      .from('farm_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent alerts:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getRecentAlerts:', error);
    return [];
  }
}