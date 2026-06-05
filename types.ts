export interface ResumeEvaluation {
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  skills_detected: string[];
  missing_skills: string[];
  experience_analysis: string;
  project_feedback: string;
  resume_tips: string[];
  ats_score: number;
  ats_issues: string[];
  final_verdict: 'Reject' | 'Consider' | 'Strong Hire' | string;
}

export interface SampleResume {
  name: string;
  category: string;
  text: string;
}

export interface SampleJob {
  role: string;
  company: string;
  description: string;
}
