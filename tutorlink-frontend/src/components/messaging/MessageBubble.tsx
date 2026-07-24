import { Message } from '../../types/messaging.types';

interface Props {
  message: Message;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
  showAvatar?: boolean;
  contactInitial?: string;
}

const MessageBubble = ({
  message,
  isFirstInGroup = true,
  isLastInGroup = true,
  showAvatar = false,
  contactInitial = '',
}: Props) => (
  <div
    className={`flex items-end gap-2
      ${message.isOwn ? 'justify-end' : 'justify-start'}
      ${isFirstInGroup ? 'mt-3' : 'mt-0.5'}`}
  >
    {/* Avatar — uniquement sur le dernier message reçu d'un groupe,
        sinon un espace vide de la même taille pour garder l'alignement */}
    {!message.isOwn && (
      <div className="w-6 h-6 flex-shrink-0">
        {showAvatar && (
          <div className="w-6 h-6 rounded-full bg-yellow-400
                          flex items-center justify-center
                          text-[10px] font-bold text-gray-900">
            {contactInitial}
          </div>
        )}
      </div>
    )}

    <div className="max-w-xs lg:max-w-md xl:max-w-lg">
      {/* Contenu du message — coin "pointu" du côté de la queue,
          seulement sur le dernier message du groupe */}
      <div className={`px-4 py-2.5 text-sm leading-relaxed
        ${message.isOwn
          ? `bg-[#1a2744] text-white rounded-2xl
             ${isLastInGroup ? 'rounded-br-sm' : ''}`
          : `bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl
             ${isLastInGroup ? 'rounded-bl-sm' : ''}`
        }`}>
        {message.content}
      </div>

      {/* Heure + statut — uniquement sur le dernier message du groupe */}
      {isLastInGroup && (
        <div className={`flex items-center gap-1 mt-1
          ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-400">{message.timestamp}</span>
          {message.isOwn && (
            <span className={`text-xs ${message.status === 'lu' ? 'text-blue-400' : 'text-gray-400'}`}>
              {message.status === 'lu' ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      )}
    </div>
  </div>
);

export default MessageBubble;
