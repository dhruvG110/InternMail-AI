// Application Types
export interface Application {
  id: number;
  userId: number;
  companyName: string;
  roleTitle: string;
  jobUrl?: string;
  location?: string;
  status: "SAVED" | "APPLIED" | "OA" | "TECHNICAL_ROUND" | "HR_ROUND" | "FINAL_ROUND" | "INTERVIEW" | "OFFER" | "REJECTED" | "WITHDRAWN";
  source: "LINKEDIN" | "REFERRAL" | "CAREERS_PAGE" | "COLD_EMAIL" | "CAMPUS" | "INDEED" | "OTHER";
  referralUsed: boolean;
  resumeId?: number;
  appliedDate: string;
  lastFollowupDate?: string;
  followupCount: number;
  salaryRange?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationInput {
  companyName: string;
  roleTitle: string;
  jobUrl: string;
  status: Application["status"];
  source: Application["source"];
  referralUsed: boolean;
  notes?: string;
}

export interface UpdateApplicationInput {
  status?: Application["status"];
  notes?: string;
  jobUrl?: string;
  referralUsed?: boolean;
  roleTitle?: string;
  companyName?: string;
}

// Resume Types
export interface Resume {
  id: number;
  userId: number;
  name: string;
  version?: string;
  fileUrl: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeInput {
  name: string;
  fileUrl: string;
  isDefault?: boolean;
}

// Interview Types
export interface Interview {
  id: number;
  applicationId: number;
  interviewDate: string;
  round: "OA" | "TECHNICAL" | "HR" | "FINAL";
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  application?: Application;
}

export interface CreateInterviewInput {
  applicationId: number;
  interviewDate: string;
  round: Interview["round"];
  status?: Interview["status"];
  feedback?: string;
}

// Profile Types
export interface Profile {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  targetRole?: string;
  graduationYear?: number;
  preferredLocation?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileInput {
  fullName?: string;
  avatarUrl?: string;
  targetRole?: string;
  graduationYear?: number;
  preferredLocation?: string;
}

// Analytics Types
export interface DashboardMetrics {
  ApplicatioMetrics: number;
  offerMetrics: number;
  rejectedMetrics: number;
  inRounds: number;
  responseRate: number;
  offerRate: number;
}

// AI Types
export interface AIInsights {
  insights: string;
  stats: {
    totalApplications: number;
    offers: number;
    rejections: number;
    interviews: number;
    responseRate: number;
    offerRate: number;
    topSource: string;
    topRole: string;
  };
}

export interface AICoachingResponse {
  advice: string;
}
