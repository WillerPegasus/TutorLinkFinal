import { useState } from 'react';
import { TutorSubscription, SubscriptionOperator } from '../types/subscription.types';

// Hook abonnement pour un groupe spécifique
// Le répétiteur admin du groupe gère cet abonnement
export const useGroupSubscription = (groupId: string) => {

  // ── ABONNEMENT GROUPE MOCK ──
  const [subscription, setSubscription] = useState<TutorSubscription>({
    id: `gsub-${groupId}`,
    tutorId: 'me',
    status: 'trial',
    trialStartDate: '2026-06-10',
    trialEndDate: '2026-07-10',
    currentPeriodStart: '2026-06-10',
    currentPeriodEnd: '2026-07-10',
    monthlyPrice: 5000,   // ← 5000 FCFA pour les groupes
    daysRemaining: 7,
    isTrialPeriod: true,
    autoRenew: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = async (operator: SubscriptionOperator) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 1500));
    setLoading(false);
    setSuccess(true);
    setSubscription(prev => ({
      ...prev,
      status: 'active',
      isTrialPeriod: false,
      daysRemaining: 30,
    }));
    setTimeout(() => {
      setShowModal(false);
      setSuccess(false);
    }, 2000);
  };

  return {
    subscription, showModal, setShowModal,
    loading, success, handlePay,
  };
};