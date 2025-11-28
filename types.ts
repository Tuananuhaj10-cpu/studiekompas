export enum EducationLevel {
  HAVO = 'HAVO',
  VWO = 'VWO',
  MBO = 'MBO'
}

export enum ProfileType {
  CM = 'Cultuur & Maatschappij',
  EM = 'Economie & Maatschappij',
  NG = 'Natuur & Gezondheid',
  NT = 'Natuur & Techniek',
  OTHER = 'Anders/Niet van toepassing'
}

export interface UserProfile {
  name: string;
  level: EducationLevel;
  profile: ProfileType;
  favoriteSubjects: string;
  hobbies: string;
  workStyle: string; // e.g. "Theory", "Practice", "Mix"
  dreamJob: string;
}

export interface StudyRecommendation {
  id: string;
  name: string;
  level: string; // WO or HBO
  description: string;
  matchScore: number; // 0-100
  matchReason: string;
  careerOpportunities: string[];
  keySubjects: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
