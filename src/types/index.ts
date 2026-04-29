import type { Session, User } from "@supabase/supabase-js";

export type ApprovalStatus = "pending" | "approved" | "rejected";
export type MaterialKind = "note" | "solution" | "slide" | "question" | "other";
export type CourseCategory = "core" | "major";

export type Course = {
  id: string;
  code: string;
  title: string;
  semester: number | null;
  prerequisite: string | null;
  credit: string;
  category: CourseCategory;
  major: string | null;
};

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: "student" | "admin";
  created_at: string;
};

export type Note = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  material_kind: MaterialKind;
  uploaded_by: string;
  approval_status: ApprovalStatus;
  created_at: string;
  course?: Course;
};

export type StudentSubmission = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  material_kind: MaterialKind;
  student_id: string;
  approval_status: ApprovalStatus;
  review_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  course?: Course;
};

export type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

export type RouteName =
  | "splash"
  | "onboarding"
  | "auth"
  | "forgotPassword"
  | "otp"
  | "courses"
  | "courseDetail"
  | "preview"
  | "submit"
  | "submissions"
  | "admin"
  | "profile"
  | "privacy"
  | "terms"
  | "notifications"
  | "leaderboard";

export type Route = {
  name: RouteName;
  params?: Record<string, unknown>;
};

export type FileAsset = {
  uri: string;
  name: string;
  mimeType?: string | null;
  size?: number | null;
};
