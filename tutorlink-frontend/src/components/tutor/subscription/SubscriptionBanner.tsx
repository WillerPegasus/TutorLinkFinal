import { useNavigate, useLocation } from 'react-router-dom';
import { TutorSubscription } from '../../../types/subscription.types';

interface Props { subscription: TutorSubscription; }

// Bandeau d'alerte affiché en haut du dashboard répétiteur
// Visible uniquement quand le compte nécessite une attention
const SubscriptionBanner = ({ subscription: s }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ne pas afficher si tout va bien
  if (s.status === 'active' && s.daysRemaining > 10) return null;

  const config = {
    trial: s.daysRemaining <= 14 ? {
      bg: 'bg-blue-600',
      message: `🎁 Essai gratuit : ${s.daysRemaining} jours restants. Activez votre abonnement pour continuer.`,
      urgent: s.daysRemaining <= 5,
    } : null,
    active: s.daysRemaining <= 10 ? {
      bg: 'bg-orange-500',
      message: `⏳ Abonnement : ${s.daysRemaining} jours restants. Renouvelez maintenant.`,
      urgent: s.daysRemaining <= 3,
    } : null,
    grace: {
      bg: 'bg-orange-600',
      message: `⚠️ Délai de grâce : ${s.daysRemaining} jours pour payer avant suspension.`,
      urgent: true,
    },
    suspended: {
      bg: 'bg-red-600',
      message: '🚫 Compte suspendu — Vous ne recevez plus de réservations. Payez pour réactiver.',
      urgent: true,
    },
    expired: {
      bg: 'bg-red-600',
      message: '❌ Abonnement expiré — Renouvelez immédiatement.',
      urgent: true,
    },
  }[s.status];

  if (!config) return null;

  // Si on est déjà sur la page abonnement, naviguer ne fait rien
  // (React Router ignore une navigation vers la route courante) —
  // on scrolle plutôt vers la carte de renouvellement déjà visible.
  const handleClick = () => {
    if (location.pathname === '/repetiteur/abonnement') {
      document.getElementById('subscription-status-card')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      navigate('/repetiteur/abonnement');
    }
  };

  return (
    <div className={`${config.bg} text-white px-5 py-3
                     flex items-center justify-between
                     ${config.urgent ? 'animate-pulse' : ''}`}>
      <p className="text-sm font-medium">{config.message}</p>
      <button
        onClick={handleClick}
        className="bg-white text-gray-900 text-xs font-bold
                   px-4 py-1.5 rounded-lg cursor-pointer
                   hover:bg-gray-100 transition-colors flex-shrink-0 ml-4"
      >
        Gérer mon abonnement →
      </button>
    </div>
  );
};

export default SubscriptionBanner;
