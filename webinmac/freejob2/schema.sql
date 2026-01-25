-- Freejob Database Schema
-- Supabase Migration File

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('client', 'freelancer', 'admin');
CREATE TYPE availability_status AS ENUM ('available', 'busy');
CREATE TYPE quotation_status AS ENUM ('open', 'closed');
CREATE TYPE deal_status AS ENUM ('active', 'completed');

-- ============================================
-- 1. USERS TABLE (Profiles)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'freelancer',
    full_name TEXT NOT NULL,
    bio_short TEXT, -- Card view description
    bio_long TEXT, -- Profile view description
    skills_tags TEXT[] DEFAULT ARRAY[]::TEXT[], -- Crucial for sifting logic
    availability_status availability_status DEFAULT 'available',
    is_duplicate_flag BOOLEAN DEFAULT FALSE, -- For users with similar names/data
    stats_completed_jobs INTEGER DEFAULT 0,
    avatar_url TEXT, -- Placeholder URLs (e.g., pravatar.cc)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster tag searches (crucial for "sand sifting")
CREATE INDEX idx_users_skills_tags ON users USING GIN (skills_tags);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_availability ON users (availability_status);
CREATE INDEX idx_users_email ON users (email);

-- ============================================
-- 2. JOB_CATEGORIES TABLE (Taxonomy)
-- ============================================
CREATE TABLE job_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE, -- e.g., "Home & Living"
    slug TEXT NOT NULL UNIQUE, -- URL-friendly identifier
    tags TEXT[] DEFAULT ARRAY[]::TEXT[], -- Related tags for this category
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for tag searches
CREATE INDEX idx_job_categories_tags ON job_categories USING GIN (tags);
CREATE INDEX idx_job_categories_slug ON job_categories (slug);

-- ============================================
-- 3. QUOTATIONS TABLE (The Bidding System)
-- ============================================
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    freelancer_ids UUID[] DEFAULT ARRAY[]::UUID[], -- Array of targeted freelancers
    job_description TEXT NOT NULL,
    status quotation_status DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for quotations
CREATE INDEX idx_quotations_client_id ON quotations (client_id);
CREATE INDEX idx_quotations_freelancer_ids ON quotations USING GIN (freelancer_ids);
CREATE INDEX idx_quotations_status ON quotations (status);

-- ============================================
-- 4. DEALS TABLE (Active Jobs)
-- ============================================
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    freelancer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status deal_status DEFAULT 'active',
    current_scope TEXT, -- The "Pinned Agreement"
    scope_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Ensure client and freelancer are different
    CONSTRAINT deals_different_users CHECK (client_id != freelancer_id)
);

-- Indexes for deals
CREATE INDEX idx_deals_client_id ON deals (client_id);
CREATE INDEX idx_deals_freelancer_id ON deals (freelancer_id);
CREATE INDEX idx_deals_quotation_id ON deals (quotation_id);
CREATE INDEX idx_deals_status ON deals (status);

-- ============================================
-- 5. CHAT_LOGS TABLE (Text Only)
-- ============================================
CREATE TABLE chat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL, -- Strictly text only, no images
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for chat logs
CREATE INDEX idx_chat_logs_deal_id ON chat_logs (deal_id);
CREATE INDEX idx_chat_logs_sender_id ON chat_logs (sender_id);
CREATE INDEX idx_chat_logs_created_at ON chat_logs (created_at DESC);

-- ============================================
-- TRIGGERS: Auto-update updated_at timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_categories_updated_at BEFORE UPDATE ON job_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- Users: Can read all profiles, update own profile
CREATE POLICY "Users can view all profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Job Categories: Public read access
CREATE POLICY "Job categories are publicly readable" ON job_categories
    FOR SELECT USING (true);

-- Quotations: Clients can manage their own, freelancers can view open ones
CREATE POLICY "Clients can manage own quotations" ON quotations
    FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Freelancers can view open quotations" ON quotations
    FOR SELECT USING (status = 'open' OR auth.uid() = ANY(freelancer_ids));

-- Deals: Participants can view and update their deals
CREATE POLICY "Deal participants can view deals" ON deals
    FOR SELECT USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

CREATE POLICY "Deal participants can update deals" ON deals
    FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = freelancer_id);

-- Chat Logs: Only deal participants can read/write
CREATE POLICY "Deal participants can view chat logs" ON chat_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM deals
            WHERE deals.id = chat_logs.deal_id
            AND (deals.client_id = auth.uid() OR deals.freelancer_id = auth.uid())
        )
    );

CREATE POLICY "Deal participants can create chat logs" ON chat_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM deals
            WHERE deals.id = chat_logs.deal_id
            AND (deals.client_id = auth.uid() OR deals.freelancer_id = auth.uid())
        )
        AND sender_id = auth.uid()
    );
