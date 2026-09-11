// ============================================
// JanaDrishti — TypeScript Database Types
// Civic Accountability Platform for Vijayapura
// ============================================

export type IssueStatus =
  | 'reported'
  | 'validated'
  | 'routed'
  | 'acknowledged'
  | 'in_progress'
  | 'resolution_claimed'
  | 'verified'
  | 'disputed'
  | 'closed'
  | 'auto_closed'

export type EscalationLevel = 'none' | 'level_1' | 'level_2' | 'level_3'

export type UserRole = 'citizen' | 'official' | 'dept_head' | 'commissioner' | 'admin'

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'

export type MediaContext = 'report' | 'resolution' | 'dispute'

// ---- Table Row Types ----

export interface DbUser {
  id: string
  phone: string
  display_name: string | null
  role: UserRole
  ward_id: string | null
  preferred_lang: string
  avatar_url: string | null
  credibility: number
  is_anonymous: boolean
  reports_count: number
  verified_count: number
  created_at: string
  updated_at: string
}

export interface DbWard {
  id: string
  ward_number: number
  name: string
  name_kn: string | null
  boundary: unknown // PostGIS geometry
  corporator_name: string | null
  corporator_phone: string | null
  created_at: string
}

export interface DbDepartment {
  id: string
  name: string
  name_kn: string | null
  slug: string
  head_user_id: string | null
  contact_phone: string | null
  contact_email: string | null
  created_at: string
}

export interface DbIssueCategory {
  id: string
  name: string
  name_kn: string | null
  name_hi: string | null
  slug: string
  icon: string | null
  department_id: string | null
  default_severity: SeverityLevel
  sla_acknowledge_hours: number
  sla_begin_work_hours: number
  sla_complete_hours: number
  escalation_l1_hours: number
  escalation_l2_hours: number
  escalation_dc_hours: number
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface DbIssue {
  id: string
  issue_number: number
  reporter_id: string
  is_anonymous: boolean
  title: string | null
  description: string | null
  category_id: string
  location: unknown // PostGIS point — use lat/lng from API response
  address: string | null
  ward_id: string | null
  status: IssueStatus
  severity: SeverityLevel
  assigned_dept_id: string | null
  assigned_to_id: string | null
  escalation: EscalationLevel
  upvote_count: number
  reported_at: string
  acknowledged_at: string | null
  work_started_at: string | null
  resolution_claimed_at: string | null
  verified_at: string | null
  closed_at: string | null
  sla_acknowledge_by: string | null
  sla_begin_work_by: string | null
  sla_complete_by: string | null
  created_at: string
  updated_at: string
}

export interface DbIssueMedia {
  id: string
  issue_id: string
  uploaded_by: string | null
  media_type: 'photo' | 'video'
  storage_path: string
  public_url: string
  thumbnail_url: string | null
  capture_lat: number | null
  capture_lng: number | null
  captured_at: string
  device_info: Record<string, unknown> | null
  media_context: MediaContext
  created_at: string
}

export interface DbIssueTimeline {
  id: string
  issue_id: string
  event_type: string
  old_status: IssueStatus | null
  new_status: IssueStatus | null
  actor_id: string | null
  actor_role: UserRole | null
  description: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface DbUpvote {
  id: string
  issue_id: string
  user_id: string
  created_at: string
}

export interface DbEscalation {
  id: string
  issue_id: string
  level: EscalationLevel
  triggered_at: string
  triggered_by: string
  notified_users: string[] | null
  notification_sent: boolean
  resolved_at: string | null
  metadata: Record<string, unknown> | null
  created_at: string
}

export interface DbVerification {
  id: string
  issue_id: string
  verifier_id: string | null
  is_verified: boolean
  comment: string | null
  media_id: string | null
  verification_lat: number | null
  verification_lng: number | null
  created_at: string
}

export interface DbNotification {
  id: string
  user_id: string
  title: string
  body: string
  type: string
  issue_id: string | null
  is_read: boolean
  sent_via_push: boolean
  created_at: string
}

// ---- Enriched API Response Types ----

export interface IssueWithDetails extends DbIssue {
  lat: number
  lng: number
  category: DbIssueCategory
  ward: DbWard | null
  department: DbDepartment | null
  reporter: Pick<DbUser, 'id' | 'display_name' | 'is_anonymous'> | null
  media: DbIssueMedia[]
  timeline: DbIssueTimeline[]
  user_has_upvoted?: boolean
}

export interface IssueListItem extends DbIssue {
  lat: number
  lng: number
  category: Pick<DbIssueCategory, 'id' | 'name' | 'name_kn' | 'slug' | 'icon'>
  ward: Pick<DbWard, 'id' | 'ward_number' | 'name'> | null
  department: Pick<DbDepartment, 'id' | 'name' | 'slug'> | null
  cover_photo: string | null
  user_has_upvoted?: boolean
}

// ---- Supabase Database generic type (for createClient<Database>) ----

export interface Database {
  public: {
    Tables: {
      users: { Row: DbUser; Insert: Partial<DbUser>; Update: Partial<DbUser> }
      wards: { Row: DbWard; Insert: Partial<DbWard>; Update: Partial<DbWard> }
      departments: { Row: DbDepartment; Insert: Partial<DbDepartment>; Update: Partial<DbDepartment> }
      issue_categories: { Row: DbIssueCategory; Insert: Partial<DbIssueCategory>; Update: Partial<DbIssueCategory> }
      issues: { Row: DbIssue; Insert: Partial<DbIssue>; Update: Partial<DbIssue> }
      issue_media: { Row: DbIssueMedia; Insert: Partial<DbIssueMedia>; Update: Partial<DbIssueMedia> }
      issue_timeline: { Row: DbIssueTimeline; Insert: Partial<DbIssueTimeline>; Update: Partial<DbIssueTimeline> }
      upvotes: { Row: DbUpvote; Insert: Partial<DbUpvote>; Update: Partial<DbUpvote> }
      escalations: { Row: DbEscalation; Insert: Partial<DbEscalation>; Update: Partial<DbEscalation> }
      verifications: { Row: DbVerification; Insert: Partial<DbVerification>; Update: Partial<DbVerification> }
      notifications: { Row: DbNotification; Insert: Partial<DbNotification>; Update: Partial<DbNotification> }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      issue_status: IssueStatus
      escalation_level: EscalationLevel
      user_role: UserRole
      severity_level: SeverityLevel
    }
  }
}
