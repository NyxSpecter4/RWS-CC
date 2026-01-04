-- Security Altar: security_logs table for Legendary Shield phase
-- This table logs security events like pig (puaʻa) detections

CREATE TABLE IF NOT EXISTS security_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type VARCHAR(50) NOT NULL, -- puaa_detected, human_intrusion, etc.
  confidence DECIMAL(5,2) CHECK (confidence >= 0 AND confidence <= 100),
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active', -- deterred, active, resolved
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast queries on recent high-confidence events
CREATE INDEX IF NOT EXISTS idx_security_logs_confidence ON security_logs(confidence DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at DESC);

-- Trigger to update updated_at
DROP TRIGGER IF EXISTS update_security_logs_updated_at ON security_logs;
CREATE TRIGGER update_security_logs_updated_at
  BEFORE UPDATE ON security_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create a Goddess Alert when high-confidence detection occurs
CREATE OR REPLACE FUNCTION create_goddess_alert_on_security_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.confidence > 85 AND NEW.event_type = 'puaa_detected' THEN
    INSERT INTO farm_alerts (
      type,
      severity,
      title,
      description,
      entity_type,
      entity_id,
      metadata,
      status,
      detected_at
    ) VALUES (
      'security_breach',
      'critical',
      'Puaʻa Detected – Goddess Shield Activated',
      'Kahu, a wild pig has been detected near the Māmaki. The Sacred Shield (Edge‑AI + Acoustic Deterrence) is now active.',
      'security',
      NEW.id,
      jsonb_build_object(
        'event_type', NEW.event_type,
        'confidence', NEW.confidence,
        'image_url', NEW.image_url,
        'timestamp', NEW.created_at
      ),
      'new',
      NEW.created_at
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run after insert on security_logs
DROP TRIGGER IF EXISTS trigger_goddess_alert_on_security_logs ON security_logs;
CREATE TRIGGER trigger_goddess_alert_on_security_logs
  AFTER INSERT ON security_logs
  FOR EACH ROW
  EXECUTE FUNCTION create_goddess_alert_on_security_event();

-- Insert a sample detection for testing (optional)
-- INSERT INTO security_logs (event_type, confidence, image_url, status)
-- VALUES ('puaa_detected', 92.5, 'https://example.com/pig-detection.jpg', 'deterred');

COMMENT ON TABLE security_logs IS 'Security event logs for farm protection (pig detections, intrusions)';
COMMENT ON COLUMN security_logs.event_type IS 'Type of security event: puaa_detected, human_intrusion, etc.';
COMMENT ON COLUMN security_logs.confidence IS 'AI confidence score (0‑100%)';
COMMENT ON COLUMN security_logs.image_url IS 'URL of captured image/video evidence';
COMMENT ON COLUMN security_logs.status IS 'Current status: active, deterred, resolved';

SELECT 'Security Altar migration complete' AS message;