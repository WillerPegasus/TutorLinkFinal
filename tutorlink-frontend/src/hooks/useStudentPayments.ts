import { useState } from 'react';

// Nouveau modèle : uniquement les cotisations de groupes
// Les cours individuels sont payés directement au répétiteur
export interface GroupPayment {
  id: string;
  reference: string;
  groupName: string;
  tutorName: string;
  subject: string;
  amount: number;
  date: string;
  period: string;               // ex: "Juillet 2026"
  status: 'reussi' | 'en_attente' | 'echoue';
}

export interface GroupPaymentStats {
  totalGroupsPayments: number;  // total cotisations payées ce mois
  activeGroups: number;         // groupes actifs
  nextPaymentDate: string;      // prochain renouvellement
  nextPaymentAmount: number;    // montant prochain paiement
}

export const useStudentPayments = () => {

  // ── COTISATIONS GROUPES MOCK ──
  const [payments] = useState<GroupPayment[]>([
    {
      id: 'gp1',
      reference: 'GRP-2026-017',
      groupName: 'Maths BAC C/D · Groupe Élite',
      tutorName: 'M. Kamga Eric',
      subject: 'Mathématiques',
      amount: 7000,
      date: '2026-06-01',
      period: 'Juin 2026',
      status: 'reussi',
    },
    {
      id: 'gp2',
      reference: 'GRP-2026-016',
      groupName: 'English Club · Conversation',
      tutorName: 'Mlle Fotso Aline',
      subject: 'Anglais',
      amount: 5000,
      date: '2026-06-01',
      period: 'Juin 2026',
      status: 'reussi',
    },
    {
      id: 'gp3',
      reference: 'GRP-2026-015',
      groupName: 'Maths BAC C/D · Groupe Élite',
      tutorName: 'M. Kamga Eric',
      subject: 'Mathématiques',
      amount: 7000,
      date: '2026-07-01',
      period: 'Juillet 2026',
      status: 'en_attente',
    },
    {
      id: 'gp4',
      reference: 'GRP-2026-010',
      groupName: 'Maths BAC C/D · Groupe Élite',
      tutorName: 'M. Kamga Eric',
      subject: 'Mathématiques',
      amount: 7000,
      date: '2026-05-01',
      period: 'Mai 2026',
      status: 'reussi',
    },
  ]);

  // Filtre statut
  const [filterStatus, setFilterStatus] =
    useState<'TOUS' | 'reussi' | 'en_attente' | 'echoue'>('TOUS');

  // Filtrage
  const filteredPayments = payments.filter(p =>
    filterStatus === 'TOUS' || p.status === filterStatus
  );

  // Statistiques
  const stats: GroupPaymentStats = {
    totalGroupsPayments: payments
      .filter(p => p.status === 'reussi')
      .reduce((sum, p) => sum + p.amount, 0),
    activeGroups: 2,
    nextPaymentDate: '2026-07-01',
    nextPaymentAmount: 12000, // 7000 + 5000
  };

  return {
    filteredPayments, filterStatus, setFilterStatus, stats,
  };
};