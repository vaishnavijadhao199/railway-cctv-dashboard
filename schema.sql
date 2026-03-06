-- database/schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Stations Table
CREATE TABLE stations (
    station_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_code VARCHAR(20) UNIQUE NOT NULL,
    station_name VARCHAR(100) NOT NULL,
    location_lat DECIMAL(10, 8),
    location_long DECIMAL(11, 8),
    zone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trains Table
CREATE TABLE trains (
    train_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    train_number VARCHAR(20) UNIQUE NOT NULL,
    train_name VARCHAR(100),
    train_type VARCHAR(50) CHECK (train_type IN ('express', 'local', 'freight', 'high_speed')),
    current_status VARCHAR(30) DEFAULT 'idle' CHECK (current_status IN ('idle', 'running', 'maintenance', 'emergency')),
    current_station_id UUID REFERENCES stations(station_id),
    capacity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cameras Table
CREATE TABLE cameras (
    camera_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    camera_code VARCHAR(30) UNIQUE NOT NULL,
    camera_name VARCHAR(100) NOT NULL,
    location_type VARCHAR(50) CHECK (location_type IN ('platform', 'track', 'entrance', 'exit', 'yard', 'crossing')),
    station_id UUID REFERENCES stations(station_id),
    train_id UUID REFERENCES trains(train_id),
    ip_address VARCHAR(45),
    mac_address VARCHAR(17),
    stream_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance', 'error')),
    resolution VARCHAR(20),
    fps INTEGER DEFAULT 30,
    recording_enabled BOOLEAN DEFAULT TRUE,
    ai_enabled BOOLEAN DEFAULT TRUE,
    last_heartbeat TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Videos Table
CREATE TABLE videos (
    video_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    camera_id UUID NOT NULL REFERENCES cameras(camera_id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    file_size_mb DECIMAL(10, 2),
    duration_seconds INTEGER,
    format VARCHAR(10) DEFAULT 'mp4',
    resolution VARCHAR(20),
    recording_started_at TIMESTAMP NOT NULL,
    recording_ended_at TIMESTAMP,
    storage_status VARCHAR(20) DEFAULT 'active' CHECK (storage_status IN ('active', 'archived', 'deleted')),
    thumbnail_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Detections Table
CREATE TABLE ai_detections (
    detection_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID REFERENCES videos(video_id) ON DELETE SET NULL,
    camera_id UUID NOT NULL REFERENCES cameras(camera_id),
    detection_type VARCHAR(50) NOT NULL CHECK (detection_type IN (
        'person', 'vehicle', 'animal', 'object', 'fire', 'smoke', 
        'crowd', 'loitering', 'intrusion', 'unattended_bag', 'weapon',
        'slip_fall', 'track_obstruction', 'platform_crowding'
    )),
    confidence_score DECIMAL(5, 4) CHECK (confidence_score BETWEEN 0 AND 1),
    bounding_box JSONB,
    frame_number INTEGER,
    timestamp TIMESTAMP NOT NULL,
    snapshot_path VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts Table
CREATE TABLE alerts (
    alert_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    detection_id UUID REFERENCES ai_detections(detection_id) ON DELETE SET NULL,
    camera_id UUID REFERENCES cameras(camera_id),
    station_id UUID REFERENCES stations(station_id),
    train_id UUID REFERENCES trains(train_id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'acknowledged', 'resolved', 'false_positive')),
    acknowledged_by UUID,
    acknowledged_at TIMESTAMP,
    resolved_by UUID,
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alert Rules Table
CREATE TABLE alert_rules (
    rule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_name VARCHAR(100) NOT NULL,
    detection_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    conditions JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_cameras_station ON cameras(station_id);
CREATE INDEX idx_cameras_status ON cameras(status);
CREATE INDEX idx_videos_camera ON videos(camera_id);
CREATE INDEX idx_videos_created ON videos(created_at DESC);
CREATE INDEX idx_detections_camera ON ai_detections(camera_id);
CREATE INDEX idx_detections_type ON ai_detections(detection_type);
CREATE INDEX idx_detections_timestamp ON ai_detections(timestamp DESC);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);