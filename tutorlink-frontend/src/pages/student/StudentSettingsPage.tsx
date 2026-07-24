import { useStudentSettings } from '../../hooks/useStudentSettings';
import SettingsSidebar from '../../components/student/settings/SettingsSidebar';
import ProfileSection from '../../components/student/settings/ProfileSection';
import SecuritySection from '../../components/student/settings/SecuritySection';
import NotificationsSection from '../../components/student/settings/NotificationsSection';
import PrivacySection from '../../components/student/settings/PrivacySection';
import DeleteAccountModal from '../../components/student/settings/DeleteAccountModal';

const StudentSettingsPage = () => {
  const {
    activeSection, setActiveSection,
    profile, setProfile,
    passwordData, setPasswordData,
    passwordError, passwordSuccess,
    notifPrefs, privacy,
    saving, saved,
    showDeleteConfirm, setShowDeleteConfirm,
    handleSaveProfile, handleChangePassword,
    toggleNotifPref, togglePrivacy,
    handleDeleteAccount,
  } = useStudentSettings();

  return (
    <div className="flex flex-col gap-6">

      {/* Titre */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">
          ⚙️ Paramètres
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Gérez votre profil et vos préférences.
        </p>
      </div>

      {/* Layout sidebar + contenu */}
      <div className="flex gap-6">

        {/* Menu latéral */}
        <SettingsSidebar
          activeSection={activeSection}
          onSelect={setActiveSection}
        />

        {/* Contenu selon section active */}
        <div className="flex-1">
          {activeSection === 'profil' && (
            <ProfileSection
              profile={profile}
              onChange={setProfile}
              onSave={handleSaveProfile}
              saving={saving}
              saved={saved}
            />
          )}

          {activeSection === 'securite' && (
            <SecuritySection
              passwordData={passwordData}
              onChange={setPasswordData}
              onSubmit={handleChangePassword}
              error={passwordError}
              success={passwordSuccess}
              saving={saving}
            />
          )}

          {activeSection === 'notifications' && (
            <NotificationsSection
              prefs={notifPrefs}
              onToggle={toggleNotifPref}
            />
          )}

          {activeSection === 'confidentialite' && (
            <PrivacySection
              settings={privacy}
              onToggle={togglePrivacy}
              onDeleteAccount={() => setShowDeleteConfirm(true)}
            />
          )}
        </div>
      </div>

      {/* Modal suppression compte */}
      {showDeleteConfirm && (
        <DeleteAccountModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default StudentSettingsPage;