import { Conversation } from '../../../types/messaging.types';
import { useNavigate } from 'react-router-dom';

interface Props { conversation: Conversation; }

const TutorChatHeader = ({ conversation }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-100 px-5 py-3
                    flex items-center justify-between">

      {/* Infos contact */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-blue-100
                          flex items-center justify-center
                          text-blue-800 font-bold">
            {conversation.contactName.charAt(0)}
          </div>
          {conversation.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3
                            rounded-full bg-green-400
                            border-2 border-white" />
          )}
        </div>
        <div>
          <p className="font-bold text-gray-800 text-sm">
            {conversation.contactName}
          </p>
          <p className="text-xs text-gray-400">
            {conversation.isOnline ? '🟢 En ligne' : '⚫ Hors ligne'}
            {' · '}{conversation.contactRole}
          </p>
        </div>
      </div>

      {/* Bouton retour dashboard */}
      <button
        onClick={() => navigate('/repetiteur/dashboard')}
        className="text-xs text-gray-400 hover:text-gray-600
                   border border-gray-200 px-3 py-1.5
                   rounded-lg cursor-pointer hover:bg-gray-50"
      >
        ← Tableau de bord
      </button>
    </div>
  );
};

export default TutorChatHeader;