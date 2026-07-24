import { useSubscription } from '../../hooks/useSubscription';
import SubscriptionStatusCard from '../../components/tutor/subscription/SubscriptionStatusCard';
import SubscriptionPaymentModal from '../../components/tutor/subscription/SubscriptionPaymentModal';
import SubscriptionNotificationsPanel from '../../components/tutor/subscription/SubscriptionNotificationsPanel';
import SubscriptionHistoryTable from '../../components/tutor/subscription/SubscriptionHistoryTable';
import AutoRenewToggle from '../../components/tutor/subscription/AutoRenewToggle';

const TutorSubscriptionPage = () => {
  const {
    subscription, payments, notifications,
    showPaymentModal, setShowPaymentModal,
    paymentLoading, paymentSuccess, paymentError,
    handlePay, handleToggleAutoRenew,
  } = useSubscription();

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          💳 Mon abonnement
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Gérez votre abonnement TutorLink — 3 000 FCFA / mois.
        </p>
      </div>

      {/* Info modèle économique */}
      <div className="bg-[#1a2744] rounded-2xl p-5 text-white">
        <h3 className="font-bold text-base mb-2">
          💡 Comment fonctionne TutorLink ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '🎁',
              title: '2 mois gratuits',
              desc: 'Testez la plateforme gratuitement pendant 60 jours.',
            },
            {
              icon: '💳',
              title: '3 000 FCFA / mois',
              desc: 'Abonnement mensuel simple. Aucune commission sur vos cours.',
            },
            {
              icon: '💰',
              title: 'Paiement direct',
              desc: 'Vos élèves vous paient directement. Vous gardez 100% de vos revenus.',
            },
          ].map(item => (
            <div key={item.title} className="flex gap-3">
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-blue-200 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carte statut abonnement */}
      <div id="subscription-status-card">
        <SubscriptionStatusCard
          subscription={subscription}
          onPay={() => setShowPaymentModal(true)}
        />
      </div>

      {/* Renouvellement automatique */}
      <AutoRenewToggle
        enabled={subscription.autoRenew}
        onToggle={handleToggleAutoRenew}
      />

      {/* Notifications */}
      <SubscriptionNotificationsPanel notifications={notifications} />

      {/* Historique paiements */}
      <SubscriptionHistoryTable payments={payments} />

      {/* FAQ abonnement */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h3 className="font-bold text-gray-700 mb-4">
          ❓ Questions fréquentes
        </h3>
        <div className="flex flex-col gap-4">
          {[
            {
              q: 'Que se passe-t-il si je ne paie pas à temps ?',
              a: 'Vous bénéficiez d\'un délai de grâce de 3 jours. Passé ce délai, votre profil est suspendu et vous ne recevez plus de demandes d\'élèves.',
            },
            {
              q: 'Puis-je annuler mon abonnement ?',
              a: 'Oui, vous pouvez arrêter à tout moment. Votre accès reste actif jusqu\'à la fin de la période payée.',
            },
            {
              q: 'Y a-t-il une commission sur mes cours ?',
              a: 'Non. Avec TutorLink, vous payez uniquement l\'abonnement mensuel. Vos élèves vous paient directement et vous gardez 100% de vos revenus.',
            },
            {
              q: 'Comment suis-je notifié avant l\'expiration ?',
              a: 'Vous recevez un SMS et un email 15 jours, 7 jours et 3 jours avant l\'expiration de votre abonnement ou de votre essai gratuit.',
            },
          ].map(faq => (
            <div key={faq.q}
              className="border-b border-gray-50 pb-4 last:border-0">
              <p className="font-bold text-gray-700 text-sm mb-1">
                {faq.q}
              </p>
              <p className="text-gray-500 text-xs leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal paiement */}
      {showPaymentModal && (
        <SubscriptionPaymentModal
          onPay={handlePay}
          onClose={() => setShowPaymentModal(false)}
          loading={paymentLoading}
          success={paymentSuccess}
          monthlyPrice={subscription.monthlyPrice}
          error={paymentError}
        />
      )}
    </div>
  );
};

export default TutorSubscriptionPage;