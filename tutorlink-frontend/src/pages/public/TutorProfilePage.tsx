import { useParams, Link } from 'react-router-dom';
import { useTutorProfile } from '../../hooks/useTutorProfile';
import TutorProfileHeader from '../../components/tutorProfile/TutorProfileHeader';
import TutorBioSection from '../../components/tutorProfile/TutorBioSection';
import SubjectsTaughtPanel from '../../components/tutorProfile/SubjectsTaughtPanel';
import PublicReviewsSection from '../../components/tutorProfile/PublicReviewsSection';
import AvailabilityPreview from '../../components/tutorProfile/AvailabilityPreview';
import VerificationsPanel from '../../components/tutorProfile/VerificationsPanel';
import PublicFooter from "../../components/public/layout/PublicFooter";

const TutorProfilePage = () => {
  const { tutorId } = useParams<{ tutorId: string }>();
  const {
    loading, profile, selectedSlot,
    handleSelectSlot, handleBookCourse, handleContact,
  } = useTutorProfile(tutorId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Chargement du profil...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Repetiteur introuvable.
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50">

      {/* Navbar publique simple */}
      <nav className="bg-white border-b border-gray-100
                      px-6 py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg">
          🎓 Tutor<span className="text-yellow-500">Link</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-gray-900">Accueil</Link>
          <Link to="/repetiteurs" className="hover:text-gray-900">Répétiteurs</Link>
          <Link to="/groupes" className="hover:text-gray-900">Groupes</Link>
        </div>
        <div className="flex gap-2">
          <Link to="/connexion"
            className="border border-gray-200 text-sm px-4 py-2
                       rounded-lg hover:bg-gray-50">
            Connexion
          </Link>
          <Link to="/inscription"
            className="bg-yellow-400 hover:bg-yellow-500
                       text-gray-900 font-bold text-sm px-4 py-2
                       rounded-lg">
            S'inscrire
          </Link>
        </div>
      </nav>

      {/* En-tête profil */}
      <TutorProfileHeader profile={profile} onBook={handleBookCourse} onContact={handleContact} />

      {/* Contenu principal */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="grid grid-cols-3 gap-6">

          {/* Colonne principale — gauche */}
          <div className="col-span-2 flex flex-col gap-5">
            <TutorBioSection bio={profile.bio} />
            <SubjectsTaughtPanel subjects={profile.subjectsTaught} />
            <PublicReviewsSection
              reviews={profile.reviews}
              count={profile.reviewCount}
            />
          </div>

          {/* Colonne latérale — droite */}
          <div className="col-span-1 flex flex-col gap-5">
            <AvailabilityPreview
              slots={profile.availability}
              selectedSlot={selectedSlot}
              onSelect={handleSelectSlot}
              onBook={handleBookCourse}
            />
            <VerificationsPanel verifications={profile.verifications} />
            
<div className="bg-white rounded-xl shadow-sm p-5">
  <h3 className="font-bold text-gray-700 mb-3">
    💰 Tarifs & Paiement
  </h3>
  <div className="flex flex-col gap-2 text-sm">
    <div className="flex justify-between">
      <span className="text-gray-500">Tarif horaire</span>
      <span className="font-bold text-[#1a2744]">
        {profile.hourlyPrice.toLocaleString()} FCFA/h
      </span>
    </div>
    <div className="border-t border-gray-100 pt-2">
      <p className="text-xs text-gray-500 leading-relaxed">
        💳 Paiement direct au répétiteur via MTN MoMo ou Orange Money
        après confirmation du cours. TutorLink ne prélève aucune commission.
      </p>
    </div>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
<PublicFooter/>
</>
  );
};

export default TutorProfilePage;
