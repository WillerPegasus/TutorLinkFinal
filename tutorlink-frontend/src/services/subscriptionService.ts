import api from './api';
import { SubscriptionOperator } from '../types/subscription.types';

// Ces routes passent par SubscriptionController côté tutor-service
// (@RequestMapping("/api/tutors/me/subscription")), résolu via X-User-Id.
const subscriptionService = {

  // GET /tutors/me/subscription
  getSubscription: async () => {
    const res = await api.get('/tutors/me/subscription');
    return res.data;
  },

  // GET /tutors/me/subscription/payments
  getPaymentHistory: async () => {
    const res = await api.get('/tutors/me/subscription/payments');
    return res.data;
  },

  // POST /tutors/me/subscription/pay/mtn — { phoneNumber }
  payMtn: async (phoneNumber: string) => {
    const res = await api.post('/tutors/me/subscription/pay/mtn', { phoneNumber });
    return res.data;
  },

  // POST /tutors/me/subscription/pay/orange/init — retourne { paymentUrl, payToken, orderId }
  initOrangePayment: async () => {
    const res = await api.post('/tutors/me/subscription/pay/orange/init');
    return res.data;
  },

  // POST /tutors/me/subscription/pay/orange/confirm?orderId=...&payToken=...
  confirmOrangePayment: async (orderId: string, payToken: string) => {
    const res = await api.post('/tutors/me/subscription/pay/orange/confirm', null, {
      params: { orderId, payToken },
    });
    return res.data;
  },

  // PUT /tutors/me/subscription/auto-renew — { enabled }
  toggleAutoRenew: async (enabled: boolean) => {
    const res = await api.put('/tutors/me/subscription/auto-renew', { enabled });
    return res.data;
  },

  // GET /tutors/me/subscription/notifications — { daysRemaining, expiringSoon, isTrialPeriod, status }
  getNotifications: async () => {
    const res = await api.get('/tutors/me/subscription/notifications');
    return res.data;
  },
};

// Compat : ancien nom utilisé par le hook précédent, gardé pour éviter de
// casser d'éventuels autres imports. Préférer payMtn/initOrangePayment ci-dessus.
export const paySubscription = async (
  operator: SubscriptionOperator, phoneNumber?: string
) => {
  if (operator === 'MTN') return subscriptionService.payMtn(phoneNumber ?? '');
  return subscriptionService.initOrangePayment();
};

export default subscriptionService;
