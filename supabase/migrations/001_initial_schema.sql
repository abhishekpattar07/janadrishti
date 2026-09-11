-- ============================================
-- JanaDrishti Database Schema
-- Civic Accountability Platform for Vijayapura
-- ============================================

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE issue_status AS ENUM (
    'reported',
    'validated',
    'routed',
    'acknowledged',
    'in_progress',
    'resolution_claimed',
    'verified',
    'disputed',
    'closed',
    'auto_closed'
);

CREATE TYPE escalation_level AS ENUM (
    'none',
    'level_1',
    'level_2',
    'level_3'
);

CREATE TYPE user_role AS ENUM (
    'citizen',
    'official',
    'dept_head',
    'commissioner',
    'admin'
);

CREATE TYPE severity_level AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

-- ============================================
-- TABLES
-- ============================================

-- Users table
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone           VARCHAR(15) UNIQUE NOT NULL,
    display_name    VARCHAR(100),
    role            user_role DEFAULT 'citizen',
    ward_id         UUID,
    preferred_lang  VARCHAR(5) DEFAULT 'kn',
    avatar_url      TEXT,
    credibility     INTEGER DEFAULT 100 CHECK (credibility >= 0 AND credibility <= 200),
    is_anonymous    BOOLEAN DEFAULT false,
    reports_count   INTEGER DEFAULT 0,
    verified_count  INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Wards table (35 wards for Vijayapura)
CREATE TABLE wards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_number     INTEGER UNIQUE NOT NULL,
    name            VARCHAR(200) NOT NULL,
    name_kn         VARCHAR(200),
    boundary        GEOMETRY(POLYGON, 4326),
    corporator_name VARCHAR(200),
    corporator_phone VARCHAR(15),
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_wards_boundary ON wards USING GIST(boundary);

-- Add foreign key after wards exists
ALTER TABLE users ADD CONSTRAINT fk_users_ward FOREIGN KEY (ward_id) REFERENCES wards(id);

-- Departments table
CREATE TABLE departments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    name_kn         VARCHAR(200),
    slug            VARCHAR(50) UNIQUE NOT NULL,
    head_user_id    UUID REFERENCES users(id),
    contact_phone   VARCHAR(15),
    contact_email   VARCHAR(200),
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Department members (many-to-many: users <-> departments)
CREATE TABLE department_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    department_id   UUID REFERENCES departments(id) ON DELETE CASCADE,
    designation     VARCHAR(200),
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, department_id)
);

-- Issue categories with SLA timers
CREATE TABLE issue_categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    name_kn         VARCHAR(200),
    name_hi         VARCHAR(200),
    slug            VARCHAR(50) UNIQUE NOT NULL,
    icon            VARCHAR(50),
    department_id   UUID REFERENCES departments(id),
    default_severity severity_level DEFAULT 'medium',
    sla_acknowledge_hours   INTEGER NOT NULL DEFAULT 24,
    sla_begin_work_hours    INTEGER NOT NULL DEFAULT 48,
    sla_complete_hours      INTEGER NOT NULL DEFAULT 168,
    escalation_l1_hours     INTEGER NOT NULL DEFAULT 72,
    escalation_l2_hours     INTEGER NOT NULL DEFAULT 168,
    escalation_dc_hours     INTEGER NOT NULL DEFAULT 336,
    is_active       BOOLEAN DEFAULT true,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Issues (core table)
CREATE TABLE issues (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_number    SERIAL,
    reporter_id     UUID REFERENCES users(id) NOT NULL,
    is_anonymous    BOOLEAN DEFAULT false,
    title           VARCHAR(200),
    description     TEXT,
    category_id     UUID REFERENCES issue_categories(id) NOT NULL,
    location        GEOMETRY(POINT, 4326) NOT NULL,
    address         TEXT,
    ward_id         UUID REFERENCES wards(id),
    status          issue_status DEFAULT 'reported',
    severity        severity_level DEFAULT 'medium',
    assigned_dept_id UUID REFERENCES departments(id),
    assigned_to_id  UUID REFERENCES users(id),
    escalation      escalation_level DEFAULT 'none',
    upvote_count    INTEGER DEFAULT 0,
    reported_at     TIMESTAMPTZ DEFAULT now(),
    acknowledged_at TIMESTAMPTZ,
    work_started_at TIMESTAMPTZ,
    resolution_claimed_at TIMESTAMPTZ,
    verified_at     TIMESTAMPTZ,
    closed_at       TIMESTAMPTZ,
    sla_acknowledge_by TIMESTAMPTZ,
    sla_begin_work_by  TIMESTAMPTZ,
    sla_complete_by    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_issues_location ON issues USING GIST(location);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_ward ON issues(ward_id);
CREATE INDEX idx_issues_dept_status ON issues(assigned_dept_id, status);
CREATE INDEX idx_issues_reporter ON issues(reporter_id);
CREATE INDEX idx_issues_sla_ack ON issues(sla_acknowledge_by) WHERE status = 'routed';
CREATE INDEX idx_issues_sla_work ON issues(sla_begin_work_by) WHERE status = 'acknowledged';
CREATE INDEX idx_issues_sla_complete ON issues(sla_complete_by) WHERE status IN ('acknowledged', 'in_progress');

-- Issue media (photos/videos)
CREATE TABLE issue_media (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id        UUID REFERENCES issues(id) ON DELETE CASCADE,
    uploaded_by     UUID REFERENCES users(id),
    media_type      VARCHAR(10) NOT NULL CHECK (media_type IN ('photo', 'video')),
    storage_path    TEXT NOT NULL,
    public_url      TEXT NOT NULL,
    thumbnail_url   TEXT,
    capture_lat     DOUBLE PRECISION,
    capture_lng     DOUBLE PRECISION,
    captured_at     TIMESTAMPTZ NOT NULL,
    device_info     JSONB,
    media_context   VARCHAR(20) DEFAULT 'report' CHECK (media_context IN ('report', 'resolution', 'dispute')),
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_media_issue ON issue_media(issue_id);

-- Issue timeline (audit log)
CREATE TABLE issue_timeline (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id        UUID REFERENCES issues(id) ON DELETE CASCADE,
    event_type      VARCHAR(50) NOT NULL,
    old_status      issue_status,
    new_status      issue_status,
    actor_id        UUID REFERENCES users(id),
    actor_role      user_role,
    description     TEXT,
    metadata        JSONB,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_timeline_issue ON issue_timeline(issue_id);
CREATE INDEX idx_timeline_created ON issue_timeline(created_at);

-- Upvotes ("Me Too")
CREATE TABLE upvotes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id        UUID REFERENCES issues(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE(issue_id, user_id)
);

CREATE INDEX idx_upvotes_issue ON upvotes(issue_id);

-- Escalations
CREATE TABLE escalations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id        UUID REFERENCES issues(id) ON DELETE CASCADE,
    level           escalation_level NOT NULL,
    triggered_at    TIMESTAMPTZ DEFAULT now(),
    triggered_by    VARCHAR(20) DEFAULT 'system',
    notified_users  UUID[],
    notification_sent BOOLEAN DEFAULT false,
    resolved_at     TIMESTAMPTZ,
    metadata        JSONB,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_escalations_issue ON escalations(issue_id);

-- Verifications
CREATE TABLE verifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id        UUID REFERENCES issues(id) ON DELETE CASCADE,
    verifier_id     UUID REFERENCES users(id),
    is_verified     BOOLEAN NOT NULL,
    comment         TEXT,
    media_id        UUID REFERENCES issue_media(id),
    verification_lat DOUBLE PRECISION,
    verification_lng DOUBLE PRECISION,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_verifications_issue ON verifications(issue_id);

-- Notifications
CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    body            TEXT NOT NULL,
    type            VARCHAR(50) NOT NULL,
    issue_id        UUID REFERENCES issues(id),
    is_read         BOOLEAN DEFAULT false,
    sent_via_push   BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-assign ward based on GPS location
CREATE OR REPLACE FUNCTION assign_ward()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ward_id := (
        SELECT id FROM wards
        WHERE ST_Contains(boundary, NEW.location)
        LIMIT 1
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assign_ward
    BEFORE INSERT ON issues
    FOR EACH ROW
    EXECUTE FUNCTION assign_ward();

-- Auto-assign department and compute SLA deadlines based on category
CREATE OR REPLACE FUNCTION assign_department()
RETURNS TRIGGER AS $$
DECLARE
    cat RECORD;
BEGIN
    SELECT * INTO cat FROM issue_categories WHERE id = NEW.category_id;
    
    IF cat IS NOT NULL THEN
        NEW.assigned_dept_id := cat.department_id;
        NEW.severity := cat.default_severity;
        NEW.sla_acknowledge_by := NEW.reported_at + (cat.sla_acknowledge_hours || ' hours')::INTERVAL;
        NEW.sla_begin_work_by := NEW.reported_at + (cat.sla_begin_work_hours || ' hours')::INTERVAL;
        NEW.sla_complete_by := NEW.reported_at + (cat.sla_complete_hours || ' hours')::INTERVAL;
        NEW.status := 'routed';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assign_department
    BEFORE INSERT ON issues
    FOR EACH ROW
    EXECUTE FUNCTION assign_department();

-- Auto-increment/decrement upvote count
CREATE OR REPLACE FUNCTION update_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE issues SET upvote_count = upvote_count + 1, updated_at = now() WHERE id = NEW.issue_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE issues SET upvote_count = upvote_count - 1, updated_at = now() WHERE id = OLD.issue_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_upvote_count
    AFTER INSERT OR DELETE ON upvotes
    FOR EACH ROW
    EXECUTE FUNCTION update_upvote_count();

-- Auto-log timeline events on status change and update timestamps
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO issue_timeline (issue_id, event_type, old_status, new_status, description)
        VALUES (
            NEW.id,
            'status_change',
            OLD.status,
            NEW.status,
            'Status changed from ' || OLD.status || ' to ' || NEW.status
        );
        
        -- Update relevant timestamps
        IF NEW.status = 'acknowledged' THEN
            NEW.acknowledged_at := now();
        ELSIF NEW.status = 'in_progress' THEN
            NEW.work_started_at := now();
        ELSIF NEW.status = 'resolution_claimed' THEN
            NEW.resolution_claimed_at := now();
        ELSIF NEW.status = 'verified' THEN
            NEW.verified_at := now();
            NEW.closed_at := now();
        ELSIF NEW.status = 'closed' THEN
            NEW.closed_at := now();
        ELSIF NEW.status = 'auto_closed' THEN
            NEW.closed_at := now();
        END IF;
    END IF;
    
    NEW.updated_at := now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_status
    BEFORE UPDATE ON issues
    FOR EACH ROW
    EXECUTE FUNCTION log_status_change();

-- Auto-increment user reports count
CREATE OR REPLACE FUNCTION update_user_reports_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users SET reports_count = reports_count + 1, updated_at = now()
    WHERE id = NEW.reporter_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_reports_count
    AFTER INSERT ON issues
    FOR EACH ROW
    EXECUTE FUNCTION update_user_reports_count();

-- Log initial 'reported' event in timeline when issue is created
CREATE OR REPLACE FUNCTION log_issue_created()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO issue_timeline (issue_id, event_type, new_status, actor_id, description)
    VALUES (
        NEW.id,
        'created',
        NEW.status,
        NEW.reporter_id,
        'Issue reported by citizen'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_issue_created
    AFTER INSERT ON issues
    FOR EACH ROW
    EXECUTE FUNCTION log_issue_created();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Issues: publicly readable, citizens can create, assigned officials can update
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Issues are publicly readable"
    ON issues FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create issues"
    ON issues FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Assigned officials can update issues"
    ON issues FOR UPDATE
    USING (
        auth.uid() = assigned_to_id
        OR auth.uid() IN (
            SELECT user_id FROM department_members
            WHERE department_id = issues.assigned_dept_id AND is_active = true
        )
        OR EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'commissioner')
        )
    );

-- Users: publicly readable profiles, users can update own
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public user profiles"
    ON users FOR SELECT USING (true);

CREATE POLICY "Users can insert own profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE USING (auth.uid() = id);

-- Issue media: publicly readable, authenticated users can upload
ALTER TABLE issue_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media is publicly readable"
    ON issue_media FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload media"
    ON issue_media FOR INSERT
    WITH CHECK (auth.uid() = uploaded_by);

-- Issue timeline: publicly readable
ALTER TABLE issue_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Timeline is publicly readable"
    ON issue_timeline FOR SELECT USING (true);

CREATE POLICY "System can insert timeline"
    ON issue_timeline FOR INSERT
    WITH CHECK (true);

-- Upvotes: publicly readable, authenticated users can vote
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Upvotes are publicly readable"
    ON upvotes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upvote"
    ON upvotes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own upvote"
    ON upvotes FOR DELETE USING (auth.uid() = user_id);

-- Verifications: publicly readable, reporter can verify
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Verifications are publicly readable"
    ON verifications FOR SELECT USING (true);

CREATE POLICY "Users can submit verifications"
    ON verifications FOR INSERT
    WITH CHECK (auth.uid() = verifier_id);

-- Escalations: publicly readable
ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Escalations are publicly readable"
    ON escalations FOR SELECT USING (true);

CREATE POLICY "System can insert escalations"
    ON escalations FOR INSERT
    WITH CHECK (true);

-- Notifications: users read own only
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications"
    ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
    ON notifications FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Wards, departments, categories: publicly readable
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wards are publicly readable" ON wards FOR SELECT USING (true);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Departments are publicly readable" ON departments FOR SELECT USING (true);

ALTER TABLE issue_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON issue_categories FOR SELECT USING (true);

ALTER TABLE department_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Department members are publicly readable" ON department_members FOR SELECT USING (true);
