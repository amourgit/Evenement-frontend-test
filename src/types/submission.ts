// Legacy type for local storage approach
export interface Submission {
  id: string;
  eventId: string;
  answers: Record<string, any>; // fieldId -> value
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Modern API types (used by submissionsApi, fieldValidator, DynamicFormRenderer)
export interface SubmissionRecord {
  id: string;
  event_id: string;
  reference_code: string;
  answers: Record<string, any>;
  submitted_at: string;
  status: "confirmed" | "pending" | "approved" | "rejected";
}

export interface SubmissionInput {
  event_id: string;
  answers: Record<string, any>;
}

export interface SubmissionResult {
  success: boolean;
  submission?: SubmissionRecord;
  errors?: { field_id: string; message: string }[];
}

// Type alias for answers (used by fieldValidator and DynamicFormRenderer)
export type SubmissionAnswers = Record<string, string | number | boolean | string[] | null>;
