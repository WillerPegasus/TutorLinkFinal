export type GroupMemberStatus = 'actif' | 'en_attente' | 'suspendu';

export interface StudentGroupItem {
  id: string;
  name: string;
  subject: string;
  level: string;
  quartier: string;
  tutorName: string;
  tutorId: string;
  currentMembers: number;
  maxMembers: number;
  monthlyPrice: number;
  schedules: string;      // texte libre défini par le tuteur
  description: string;
  memberStatus: GroupMemberStatus;
  joinedAt: string;
  rating: number;
}

export interface SuggestedGroup {
  id: string;
  name: string;
  subject: string;
  tutorName: string;
  monthlyPrice: number;
  currentMembers: number;
  maxMembers: number;
  rating: number;
}
