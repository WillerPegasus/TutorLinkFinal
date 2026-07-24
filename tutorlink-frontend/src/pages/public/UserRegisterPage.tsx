import { Link } from 'react-router-dom';
import { useRegister } from '../../hooks/useRegister';
import StepProgressBar from '../../components/register/StepProgressBar';
import RoleSelector from '../../components/register/RoleSelector';
import PersonalInfoForm from '../../components/register/PersonalInfoForm';
import TutorPedagogicForm from '../../components/register/TutorPedagogicForm';
import TutorDocumentsForm from '../../components/register/TutorDocumentsForm';
import ConfirmationStep from '../../components/register/ConfirmationStep';
import TwoFactorInput from '../../components/admin/TwoFactorInput';

const RegisterPage = () => {
  const {
    step, role, setRole,
    baseData, setBaseData,
    tutorData, setTutorData,
    documents, previews,
    errors, loading,
    stepNumber, totalSteps,
    handleDocumentSelect, handleDocumentRemove,
    handleNext, handleBack,
    handleVerifyOtp, otpError, otpLoading,
    navigate,
  } = useRegister();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-[#1a2744] px-6 py-3
                      flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">
          🎓 Tutor<span className="text-yellow-400">Link</span>
        </Link>
        <Link to="/connexion"
          className="text-blue-200 hover:text-white text-sm">
          J'ai déjà un compte
        </Link>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm
                        border border-gray-100 overflow-hidden">
          <div className="h-1 bg-yellow-400" />

          <div className="p-6">
            {step !== 'confirmation' && step !== 'otp' && (
              <StepProgressBar
                current={stepNumber}
                total={totalSteps}
                role={role}
              />
            )}

            {/* ✅ NOUVEAU : Bandeau modèle économique pour répétiteur */}
            {role === 'REPETITEUR' && step === 'role' && (
              <div className="mb-4 bg-[#1a2744] rounded-xl p-4 text-white">
                <p className="font-bold text-sm mb-2">
                  💡 Modèle TutorLink pour répétiteurs
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: '🎁', text: '2 mois gratuits', sub: 'Essai sans engagement' },
                    { icon: '💳', text: '3 000 F/mois', sub: 'Abonnement simple' },
                    { icon: '💰', text: '0% commission', sub: 'Gardez 100% de vos revenus' },
                  ].map(item => (
                    <div key={item.text} className="bg-blue-800 rounded-lg p-2 text-center">
                      <p className="text-lg">{item.icon}</p>
                      <p className="text-xs font-bold mt-1">{item.text}</p>
                      <p className="text-xs text-blue-300">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 'role' && (
              <RoleSelector selected={role} onSelect={setRole} />
            )}
            {step === 'infos' && (
              <PersonalInfoForm
                data={baseData}
                onChange={setBaseData}
                errors={errors}
                role={role}
              />
            )}
            {step === 'pedagogique' && (
              <TutorPedagogicForm
                data={tutorData}
                onChange={setTutorData}
                errors={errors}
              />
            )}
            {step === 'documents' && (
              <TutorDocumentsForm
                documents={documents}
                previews={previews}
                errors={errors}
                onSelect={handleDocumentSelect}
                onRemove={handleDocumentRemove}
              />
            )}
            {step === 'otp' && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
                  Vérifiez votre email
                </h3>
                <p className="text-sm text-gray-500 text-center mb-6">
                  Un code à 6 chiffres a été envoyé à {baseData.email}
                </p>
                <TwoFactorInput onComplete={handleVerifyOtp} />
                {otpLoading && (
                  <p className="text-center text-sm text-gray-500 mt-4">Vérification...</p>
                )}
                {otpError && (
                  <p className="text-center text-sm text-red-600 mt-4">{otpError}</p>
                )}
              </div>
            )}

            {step === 'confirmation' && (
              <ConfirmationStep
                role={role!}
                name={`${baseData.firstName} ${baseData.lastName}`}
                onGoToLogin={() => navigate('/connexion')}
              />
            )}

            {step !== 'confirmation' && step !== 'otp' && (
              <div className="flex gap-3 mt-6">
                {step !== 'role' && (
                  <button
                    onClick={handleBack}
                    className="border border-gray-200 text-gray-600
                               px-5 py-2.5 rounded-xl hover:bg-gray-50
                               cursor-pointer transition-colors text-sm"
                  >
                    ← Retour
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={loading || (step === 'role' && !role)}
                  className="flex-1 bg-[#1a2744] hover:bg-blue-900
                             text-white font-bold py-2.5 rounded-xl
                             cursor-pointer transition-colors
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Traitement...'
                    : step === 'documents' ? '✅ Soumettre mon dossier'
                    : step === 'infos' && role === 'ELEVE_PARENT'
                      ? '🚀 Créer mon compte'
                    : 'Continuer →'
                  }
                </button>
              </div>
            )}

            {step !== 'confirmation' && step !== 'otp' && (
              <p className="text-center text-sm text-gray-500 mt-4">
                Déjà inscrit ?{' '}
                <Link to="/connexion"
                  className="text-blue-600 font-bold hover:underline">
                  Se connecter
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;