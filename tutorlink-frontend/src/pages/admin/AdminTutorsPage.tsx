import { useAdminTutors } from '../../hooks/useAdminTutors';
import TutorValidationQueue from '../../components/admin/TutorValidationQueue';
import TopRatedTutorsTable from '../../components/admin/TopRatedTutorsTable';
import DocumentViewer from '../../components/admin/DocumentViewer';

const AdminTutorsPage = () => {
  const {
    pendingOnly, topTutors,
    viewedDoc, setViewedDoc,
    handleApprove, handleReject,
  } = useAdminTutors();

  return (
    <div className="flex flex-col gap-6">

      {/* Titre de la page */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-900">
          Gestion des répétiteurs
        </h2>
        <span className="bg-orange-100 text-orange-700
                         px-4 py-1.5 rounded-full text-sm font-bold">
          {pendingOnly.length} validation(s) en attente
        </span>
      </div>

      {/* File d'attente de validation */}
      <TutorValidationQueue
        tutors={pendingOnly}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewDoc={setViewedDoc}
      />

      {/* Tableau des répétiteurs les mieux notés */}
      <TopRatedTutorsTable tutors={topTutors} />

      {/* Visionneuse de document — s'ouvre au clic sur une pièce jointe */}
      {viewedDoc && (
        <DocumentViewer
          url={viewedDoc}
          onClose={() => setViewedDoc(null)}
        />
      )}
    </div>
  );
};

export default AdminTutorsPage;