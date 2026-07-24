export type StudentCourseStatus =
  | 'confirme'
  | 'en_attente'
  | 'termine'
  | 'annule';

export interface StudentReservation {
  id: string;
  reference: string;
  tutorId: string;
  tutorName: string;
  tutorSubject: string;
  date: string;
  time: string;
  duration: number;
  status: StudentCourseStatus;
  estimatedAmount: number;
  message?: string;
  quartier: string;
}

export interface StudentReservationFilters {
  search: string;
  status: StudentCourseStatus | 'TOUS';
}
