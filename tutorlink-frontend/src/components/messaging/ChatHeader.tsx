import { Conversation } from '../../types/messaging.types';
import { useNavigate } from 'react-router-dom';

interface Props {
  conversation: Conversation;
  tutorPhone?: string;      // ← ajouté pour paiement direct
  tutorPrice?: number;      // ← tarif horaire indicatif
}

const ChatHeader = ({ conversation, tutorPhone, tutorPrice }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-100 px-5 py-3">
      <div className="flex items-center justify-between">

        {/* Infos contact */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-yellow-400
                            flex items-center justify-center font-bold">
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
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-400">
                {conversation.isOnline ? '🟢 En ligne' : '⚫ Hors ligne'}
                {' · '}{conversation.contactRole}
              </p>
              {/* ✅ NOUVEAU : infos paiement direct */}
              {tutorPhone && (
                <span className="text-xs text-blue-600 font-medium">
                  · 📱 {tutorPhone}
                  {tutorPrice && ` · ${tutorPrice.toLocaleString()} F/h`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <button
          onClick={() => navigate('/dashboard')}
          className="text-xs text-gray-400 hover:text-gray-600
                     border border-gray-200 px-3 py-1.5
                     rounded-lg cursor-pointer hover:bg-gray-50"
        >
          ← Tableau de bord
        </button>
      </div>

      {/* ✅ NOUVEAU : bandeau info paiement si c'est un répétiteur */}
      {tutorPhone && (
        <div className="mt-2 bg-yellow-50 border border-yellow-200
                        rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs text-yellow-700">
            💳 Paiement direct au répétiteur via MTN MoMo ou Orange Money
            au <strong>{tutorPhone}</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;