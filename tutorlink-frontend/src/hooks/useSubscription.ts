import { useState, useEffect, useCallback } from 'react';
import {
  TutorSubscription, SubscriptionPayment,
  SubscriptionNotification, SubscriptionOperator, SubscriptionStatus
} from '../types/subscription.types';
import subscriptionService from '../services/subscriptionService';

// Le backend n'a que TRIAL/ACTIVE/EXPIRED/SUSPENDED — pas de "grace" séparé.
const STATUS_MAP: Record<string, SubscriptionStatus> = {
  TRIAL: 'trial',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  EXPIRED: 'expired',
};

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<TutorSubscription>({
    id: '', tutorId: '', status: 'expired',
    trialStartDate: '', trialEndDate: '',
    currentPeriodStart: '', currentPeriodEnd: '',
    monthlyPrice: 3000, daysRemaining: 0,
    isTrialPeriod: false, autoRenew: false,
  });
  const [payments, setPayments] = useState<SubscriptionPayment[]>([]);
  const [notifications, setNotifications] = useState<SubscriptionNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rawSub, rawPayments, rawNotif] = await Promise.all([
        subscriptionService.getSubscription(),
        subscriptionService.getPaymentHistory(),
        subscriptionService.getNotifications().catch(() => null),
      ]);

      const status = STATUS_MAP[rawSub.status] ?? 'expired';
      const isTrialPeriod = status === 'trial';
      const daysRemaining = isTrialPeriod
        ? daysBetween(rawSub.trialEndDate)
        : daysBetween(rawSub.expiryDate);

      setSubscription({
        id: String(rawSub.id),
        tutorId: String(rawSub.tutorId),
        status,
        trialStartDate: rawSub.trialStartDate ?? '',
        trialEndDate: rawSub.trialEndDate ?? '',
        // ⚠️ Le backend ne stocke pas de date de début de période payée,
        // seulement la date d'expiration.
        currentPeriodStart: '',
        currentPeriodEnd: rawSub.expiryDate ?? '',
        monthlyPrice: 3000,
        daysRemaining,
        isTrialPeriod,
        autoRenew: !!rawSub.autoRenew,
      });

      // Historique paiements — le backend ne stocke que id/operator/amount/paidAt
      // (pas de référence, transactionId, statut ou période de facturation).
      const mappedPayments: SubscriptionPayment[] = (rawPayments ?? []).map((p: any) => {
        const d = new Date(p.paidAt);
        return {
          id: String(p.id),
          reference: `SUB-${p.id}`,
          amount: p.amount ?? 0,
          operator: (p.operator ?? 'MTN') as SubscriptionOperator,
          transactionId: '—', // non tracé par le backend
          status: 'reussi', // seuls les paiements réussis sont enregistrés
          date: isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10),
          period: isNaN(d.getTime()) ? '' : `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
        };
      });
      setPayments(mappedPayments);

      // Notifications — synthétisées côté frontend à partir de
      // {daysRemaining, expiringSoon, isTrialPeriod, status} (le backend
      // ne renvoie pas de liste de notifications horodatées).
      const notifs: SubscriptionNotification[] = [];
      if (rawNotif?.expiringSoon) {
        notifs.push({
          id: 'n-expiring',
          type: isTrialPeriod ? 'trial_ending_soon' : 'payment_due',
          message: isTrialPeriod
            ? `Votre période d'essai gratuite se termine dans ${daysRemaining} jours. Activez votre abonnement pour continuer à recevoir des élèves.`
            : `Votre abonnement expire dans ${daysRemaining} jours. Renouvelez pour éviter la suspension.`,
          daysLeft: daysRemaining,
          date: new Date().toISOString().slice(0, 10),
          isRead: false,
        });
      }
      if (status === 'suspended') {
        notifs.push({
          id: 'n-suspended',
          type: 'account_suspended',
          message: 'Votre compte est suspendu pour non-paiement. Réactivez-le pour continuer à recevoir des élèves.',
          date: new Date().toISOString().slice(0, 10),
          isRead: false,
        });
      }
      if (mappedPayments[0]) {
        notifs.push({
          id: `n-payment-${mappedPayments[0].id}`,
          type: 'payment_success',
          message: `Paiement de ${mappedPayments[0].amount.toLocaleString()} FCFA reçu pour le mois de ${mappedPayments[0].period}.`,
          date: mappedPayments[0].date,
          isRead: true,
        });
      }
      setNotifications(notifs);
    } catch (err) {
      console.error('Erreur chargement abonnement:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Payer l'abonnement (vrai appel backend)
  const handlePay = async (operator: SubscriptionOperator, phoneNumber?: string) => {
    setPaymentLoading(true);
    setPaymentError(null);
    try {
      if (operator === 'MTN') {
        if (!phoneNumber) throw new Error('Numéro de téléphone requis pour MTN MoMo.');
        await subscriptionService.payMtn(phoneNumber);
        setPaymentSuccess(true);
        await load();
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentSuccess(false);
        }, 2000);
      } else {
        // Orange Money : redirection externe puis confirmation manuelle au retour.
        const { paymentUrl, payToken, orderId } = await subscriptionService.initOrangePayment();
        if (paymentUrl) window.open(paymentUrl, '_blank');
        // Note : la confirmation (subscriptionService.confirmOrangePayment)
        // doit être appelée après le retour de paiement — à brancher sur
        // la page de callback Orange (return_url) une fois celle-ci créée.
        console.log('Orange Money — orderId/payToken à conserver pour confirmation :', orderId, payToken);
      }
    } catch (err: any) {
      console.error('Erreur paiement abonnement:', err);
      setPaymentError(
        err?.response?.data?.message ?? err?.message ?? 'Échec du paiement. Réessayez.'
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // Basculer renouvellement automatique (vrai appel backend)
  const handleToggleAutoRenew = async () => {
    const next = !subscription.autoRenew;
    setSubscription(prev => ({ ...prev, autoRenew: next })); // optimiste
    try {
      await subscriptionService.toggleAutoRenew(next);
    } catch (err) {
      console.error('Erreur toggle auto-renew:', err);
      setSubscription(prev => ({ ...prev, autoRenew: !next })); // rollback
    }
  };

  return {
    loading,
    subscription, payments, notifications,
    showPaymentModal, setShowPaymentModal,
    paymentLoading, paymentSuccess, paymentError,
    handlePay, handleToggleAutoRenew,
  };
};

function daysBetween(dateStr?: string): number {
  if (!dateStr) return 0;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
