import { useParams } from 'react-router-dom';
import { useGroupSubscription } from '../../hooks/useGroupSubscription';
import SubscriptionStatusCard from '../../components/tutor/subscription/SubscriptionStatusCard';
import SubscriptionPaymentModal from '../../components/tutor/subscription/SubscriptionPaymentModal';
import SubscriptionHistoryTable from '../../components/tutor/subscription/SubscriptionHistoryTable';

const TutorGroupSubscriptionPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const {
    subscription, showModal, setShowModal,
    loading, success, handlePay,
  } = useGroupSubscription(groupId!);

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          💳 Abonnement du groupe
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Abonnement mensuel pour maintenir votre groupe actif
          — 5 000 FCFA / mois.
        </p>
      </div>

      {/* Info modèle */}
      <div className="bg-[#1a2744] rounded-2xl p-5 text-white">
        <h3 className="font-bold mb-2">💡 Abonnement groupe TutorLink</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '🎁', title: '1 mois gratuit', desc: 'Testez avec votre groupe pendant 30 jours.' },
            { icon: '💳', title: '5 000 FCFA/mois', desc: 'Groupe actif et visible par tous les élèves.' },
            { icon: '👥', title: 'Vos élèves paient vous', desc: 'Les cotisations du groupe vous reviennent directement.' },
          ].map(item => (
            <div key={item.title} className="flex gap-2">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-blue-200 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statut abonnement */}
      <SubscriptionStatusCard
        subscription={subscription}
        onPay={() => setShowModal(true)}
      />

      {/* Historique — vide si premier mois */}
      <SubscriptionHistoryTable payments={[]} />

      {/* Modal paiement */}
      {showModal && (
        <SubscriptionPaymentModal
          onPay={handlePay}
          onClose={() => setShowModal(false)}
          loading={loading}
          success={success}
          monthlyPrice={subscription.monthlyPrice}
        />
      )}
    </div>
  );
};

export default TutorGroupSubscriptionPage;