import { useForm } from 'react-hook-form';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import TwoFactorInput from '../../components/admin/TwoFactorInput';

const AdminLoginPage = () => {
  const { isOtpStep, error, loading, handleLogin, handleVerifyOtp } = useAdminAuth();
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();

  return (
    <div style={{
      minHeight: '100vh', background: '#1a2744',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'white', borderRadius: 12, padding: 40,
        width: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ color: '#1565C0', textAlign: 'center', marginBottom: 8 }}>
          🎓 TutorLink
        </h2>
        <p style={{ textAlign: 'center', color: '#666', marginBottom: 32 }}>
          {isOtpStep ? 'Entrez le code reçu par SMS/email' : 'Accès Administrateur'}
        </p>

        {error && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: 16 }}>{error}</p>
        )}

        {!isOtpStep ? (
          <form onSubmit={handleSubmit(handleLogin)}>
            <input {...register('email', { required: true })}
              type="email" placeholder="Email administrateur"
              style={inputStyle} />
            <input {...register('password', { required: true })}
              type="password" placeholder="Mot de passe"
              style={inputStyle} />
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <div>
            <TwoFactorInput onComplete={handleVerifyOtp} />
            {loading && <p style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>Vérification...</p>}
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 16px', marginBottom: 16,
  border: '1px solid #ddd', borderRadius: 8, fontSize: 14,
  boxSizing: 'border-box',
};

const btnStyle: React.CSSProperties = {
  width: '100%', padding: 12, background: '#1a2744',
  color: 'white', border: 'none', borderRadius: 8,
  fontSize: 16, fontWeight: 'bold', cursor: 'pointer',
};

export default AdminLoginPage;