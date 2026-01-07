-- LOS! Berlin Transport Database Schema
-- Run this script to initialize the PostgreSQL database

-- Create the database (run as superuser)
-- CREATE DATABASE los_transport;

-- Connect to the database
-- \c los_transport

-- Saved journeys table
CREATE TABLE IF NOT EXISTS saved_journeys (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    origin_id VARCHAR(255) NOT NULL,
    origin_name VARCHAR(255) NOT NULL,
    destination_id VARCHAR(255) NOT NULL,
    destination_name VARCHAR(255) NOT NULL,
    stopovers JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Journey history table
CREATE TABLE IF NOT EXISTS journey_history (
    id SERIAL PRIMARY KEY,
    origin_id VARCHAR(255) NOT NULL,
    origin_name VARCHAR(255) NOT NULL,
    destination_id VARCHAR(255) NOT NULL,
    destination_name VARCHAR(255) NOT NULL,
    legs JSONB,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorite stops table
CREATE TABLE IF NOT EXISTS favorite_stops (
    id SERIAL PRIMARY KEY,
    stop_id VARCHAR(255) NOT NULL UNIQUE,
    stop_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_journeys_created ON saved_journeys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_journey_history_completed ON journey_history(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorite_stops_stop_id ON favorite_stops(stop_id);

-- Add sample data (optional)
-- INSERT INTO saved_journeys (name, origin_id, origin_name, destination_id, destination_name)
-- VALUES ('Daily Commute', '900000100003', 'S+U Alexanderplatz', '900000024101', 'S Potsdam Hauptbahnhof');


