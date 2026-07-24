// Statut d'un message
export type MessageStatus = 'envoye' | 'lu';

// Un message dans une conversation
export interface Message {
  id: string;
  senderId: string;       // ID de l'expéditeur
  content: string;        // contenu du message
  timestamp: string;      // ex: "14:25"
  status: MessageStatus;
  isOwn: boolean;         // true si envoyé par l'élève connecté
}

// Un contact dans la liste des conversations
export interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  contactRole: string;    // ex: "Mathématiques"
  lastMessage: string;    // aperçu du dernier message
  lastTime: string;       // ex: "14:32", "hier", "3j"
  unreadCount: number;    // nombre de messages non lus
  isOnline: boolean;      // statut en ligne
  avatar?: string;
}