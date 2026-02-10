
export enum UserRole {
  MENTOR = 'Empowerment Mentor',
  TALENT = 'Rising Talent'
}

export interface SkillMetric {
  name: string;
  level: number;
}

export interface UserProfile {
  name: string;
  role: UserRole;
  avatar: string;
  growthScore: number;
  completedProjects: string[];
  skills: SkillMetric[];
  totalEarned: number;
  trajectoryPoints: number[];
}

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: number;
}

export type TaskStatus = 'pending' | 'in-progress' | 'submitted' | 'verified';
export type SponsorshipType = 'Paid' | 'Unpaid' | 'CSR Sponsored';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  reward: number;
  type: 'portfolio' | 'report' | 'hours';
  submissionUrl?: string;
  submissionNote?: string;
  loggedHours?: number;
  feedback?: string;
}

export interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface ImpactProject {
  id: string;
  title: string;
  impact: string;
  skills: string[];
  description: string;
  contributors: number;
  status: 'active' | 'completed' | 'pending';
  mentorName: string;
  coMentorNames?: string[];
  partnerName: string;
  sponsorship: SponsorshipType;
  milestones: Milestone[];
  tasks: Task[];
  chatHistory: ChatMessage[];
  totalBudget?: number;
}

export interface MentorRequest {
  id: string;
  fromMentor: string;
  projectName: string;
  type: 'collaboration' | 'guidance';
  status: 'pending' | 'accepted' | 'declined';
}

export type ARRoomType = 'LOBBY' | 'LEADERSHIP_LOUNGE' | 'LEARNING_CIRCLE' | 'INTERVIEW_ROOM' | 'COLLAB_HUB';

export const ALL_PROJECTS: ImpactProject[] = [
  { 
    id: 'p1', title: 'Carbon Neutral Supply AI', impact: 'Reduced 5k tons CO2', skills: ['Data Ops', 'Sustainability'], 
    description: 'Architecture of a real-world carbon tracking circle for global logistics.', contributors: 5, status: 'active',
    mentorName: 'Dr. Sarah Lin', partnerName: 'EcoChain', sponsorship: 'Paid', milestones: [], chatHistory: [], tasks: [], totalBudget: 1200,
    coMentorNames: ['Amina Blake']
  },
  { 
    id: 'p2', title: 'Mental Wellness Bot', impact: '10k sessions led', skills: ['UX Design', 'Psychology'], 
    description: 'Designing empathetic AI interactions for post-natal support systems.', contributors: 12, status: 'active',
    mentorName: 'Rachel Green', partnerName: 'MindfulHub', sponsorship: 'CSR Sponsored', milestones: [], chatHistory: [], tasks: [], totalBudget: 850
  },
  { 
    id: 'p3', title: 'Rural Fintech Access', impact: '2k families banked', skills: ['Product Strategy', 'FinTech'], 
    description: 'Expanding micro-lending capabilities to low-bandwidth rural mobile networks.', contributors: 7, status: 'active',
    mentorName: 'Sarah Lin', partnerName: 'MicroLink', sponsorship: 'Paid', milestones: [], chatHistory: [], tasks: [], totalBudget: 1500
  },
  { 
    id: 'p4', title: 'Ocean Waste Cleanup AI', impact: '20 tons plastic removed', skills: ['CV', 'Robotics'], 
    description: 'Building autonomous navigation for waste collection drones.', contributors: 3, status: 'active',
    mentorName: 'Elena Mark', partnerName: 'OceanPulse', sponsorship: 'Paid', milestones: [], chatHistory: [], tasks: [], totalBudget: 2000
  },
  { 
    id: 'p5', title: 'Decentralized Health Hub', impact: 'Serviced 12k Patients', skills: ['Blockchain', 'UX Design'], 
    description: 'Audit and redesign medical record security in low-bandwidth health zones.', contributors: 8, status: 'active',
    mentorName: 'Amina Blake', partnerName: 'HealthNode', milestones: [], chatHistory: [], tasks: [],
    sponsorship: 'CSR Sponsored'
  },
  { 
    id: 'p6', title: 'Urban Agri-Bot Control', impact: '30% Crop Yield Increase', skills: ['Python', 'Sensors'], 
    description: 'Interface design for robotic vertical farm maintenance systems.', contributors: 3, status: 'active',
    mentorName: 'James Park', partnerName: 'VerdiCity', milestones: [], chatHistory: [], tasks: [],
    sponsorship: 'Unpaid'
  },
];
