import * as user from "./user"
import * as event from "./event"
import * as field from "./field"
import * as ai from "./ai"
import * as formConfig from "./formConfig"

export {
  user,
  event,
  field,
  ai,
  formConfig,
}
export type ProfileType = 'Étudiant' | 'Enseignant' | 'Administration' | 'Parent';

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  profile: ProfileType;
  matricule?: string;
  department?: string;
}



export interface Establishment {
  id: string;
  name: string;
  type: 'general' | 'lycee' | 'university' | 'institut';
  logoText: string;
  color: string; // Tailwind color class name, e.g., 'indigo', 'emerald', 'sky', 'rose'
  domain: string;
  address: string;
  description: string;
  stats: {
    students: number;
    teachers: number;
    coursesCount: number;
  };
  currentUser: LocalUser | null; // null if not connected/unauthenticated (captive portal needed)
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  clickable?: boolean;
}


export interface AppNotification {
  id: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success';
}

export interface AppItem {
  id: string;
  name: string;
  iconName: string;
  category: string;
  description: string;
}

export interface HelpTopic {
  id: string;
  title: string;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  teacherName: string;
  schedule: string;
  room: string;
  progress: number;
}
