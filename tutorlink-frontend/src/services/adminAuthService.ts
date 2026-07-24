import adminApi from '@/services/adminApi';
import { AdminLoginPayload, OtpPayload } from '@/types/admin.types';

const adminAuthService = {

  // Étape 1 : envoie email+password, le backend envoie un SMS/email OTP
  login: async (payload: AdminLoginPayload) => {
    const res = await adminApi.post('/auth/login', payload);
    return res.data; // { message: "OTP envoyé" }
  },

  // Étape 2 : envoie le code OTP reçu, le backend retourne le token
  verifyOtp: async (payload: OtpPayload) => {
    const res = await adminApi.post('/auth/verify-otp', payload);
    return res.data; // { token, admin }
  },
};

export default adminAuthService;