-- Meditrack Database Schema
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET row_security = on;

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'doctor', 'nurse', 'technician');
CREATE TYPE patient_status AS ENUM ('stable', 'critical', 'recovering', 'discharged');
CREATE TYPE inventory_status AS ENUM ('in_stock', 'low_stock', 'out_of_stock', 'expired');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'nurse',
    department TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id TEXT UNIQUE NOT NULL, -- Hospital patient ID
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    phone TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    medical_record_number TEXT,
    status patient_status DEFAULT 'stable',
    room_number TEXT,
    assigned_doctor_id UUID REFERENCES profiles(id),
    assigned_nurse_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient monitoring records
CREATE TABLE IF NOT EXISTS patient_monitoring (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    recorded_by UUID REFERENCES profiles(id),
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER,
    temperature DECIMAL(4,2),
    oxygen_saturation INTEGER,
    respiratory_rate INTEGER,
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory categories
CREATE TABLE IF NOT EXISTS inventory_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory items
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES inventory_categories(id),
    sku TEXT UNIQUE,
    current_quantity INTEGER DEFAULT 0,
    minimum_quantity INTEGER DEFAULT 10,
    unit_price DECIMAL(10,2),
    supplier TEXT,
    status inventory_status DEFAULT 'in_stock',
    expiry_date DATE,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory transactions
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    transaction_type TEXT CHECK (transaction_type IN ('in', 'out', 'adjustment')),
    quantity INTEGER NOT NULL,
    reason TEXT,
    performed_by UUID REFERENCES profiles(id),
    reference_number TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System logs
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default inventory categories
INSERT INTO inventory_categories (name, description) VALUES
('Medical Supplies', 'General medical supplies and consumables'),
('Medications', 'Pharmaceutical products and drugs'),
('Equipment', 'Medical equipment and devices'),
('Personal Protective Equipment', 'PPE items like masks, gloves, gowns'),
('Surgical Instruments', 'Surgical tools and instruments')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_status ON patients(status);
CREATE INDEX IF NOT EXISTS idx_patients_assigned_doctor ON patients(assigned_doctor_id);
CREATE INDEX IF NOT EXISTS idx_patients_assigned_nurse ON patients(assigned_nurse_id);
CREATE INDEX IF NOT EXISTS idx_patient_monitoring_patient_id ON patient_monitoring(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_monitoring_recorded_at ON patient_monitoring(recorded_at);
CREATE INDEX IF NOT EXISTS idx_inventory_items_status ON inventory_items(status);
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_item_id ON inventory_transactions(item_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON system_logs(created_at);

-- Row Level Security (RLS) Policies

-- Profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Patients table
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view all patients" ON patients FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Staff can insert patients" ON patients FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Staff can update patients" ON patients FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);

-- Patient monitoring table
ALTER TABLE patient_monitoring ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view all monitoring records" ON patient_monitoring FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Staff can insert monitoring records" ON patient_monitoring FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);

-- Inventory tables
ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view inventory categories" ON inventory_categories FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);

ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view inventory items" ON inventory_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Staff can manage inventory items" ON inventory_items FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);

ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can view inventory transactions" ON inventory_transactions FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);
CREATE POLICY "Staff can insert inventory transactions" ON inventory_transactions FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
);

-- System logs
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own logs" ON system_logs FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown User'));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();