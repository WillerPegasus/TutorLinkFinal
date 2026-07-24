import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuthStore } from '../store/adminAuthStore';
import api from '../services/api';

export const useAdminAuth = () => {
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAdminAuth } = useAdminAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        identifier: data.email,
        password: data.password,
      });
      if (res.data.twoFactorRequired) {
        setIdentifier(data.email);
        setIsOtpStep(true);
      } else {
        setError("Ce compte n'est pas un compte administrateur.");
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Email ou mot de passe incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-2fa', {
        identifier,
        code: otp,
      });
      setAdminAuth(res.data.token);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        'Code incorrect ou expiré.'
      );
    } finally {
      setLoading(false);
    }
  };

  return { isOtpStep, error, loading, handleLogin, handleVerifyOtp };
};
