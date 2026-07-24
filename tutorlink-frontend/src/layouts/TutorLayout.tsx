import { Outlet } from 'react-router-dom';
import TutorSidebar from '../components/tutor/TutorSidebar';
import SubscriptionBanner from '../components/tutor/subscription/SubscriptionBanner';
import { useSubscription } from '../hooks/useSubscription';

// Layout commun à toutes les pages de l'espace répétiteur
const TutorLayout = () => {
  const { subscription } = useSubscription();
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TutorSidebar />
      <div className="flex-1 flex flex-col">
        <SubscriptionBanner subscription={subscription} />
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TutorLayout;
