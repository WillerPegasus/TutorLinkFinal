import { Conversation } from '../../../types/messaging.types';

interface Props {
  conversations: Conversation[];
  activeConvId: string;
  onSelect: (id: string) => void;
}

const TutorConversationList = ({
  conversations, activeConvId, onSelect
}: Props) => (
  <div className="w-72 bg-white border-r border-gray-100
                  flex flex-col flex-shrink-0">

    {/* En-tête */}
    <div className="px-4 py-4 border-b border-gray-100">
      <h3 className="font-bold text-gray-700">💬 Messages</h3>
      <p className="text-xs text-gray-400 mt-0.5">
        Vos élèves et parents
      </p>
      {/* Recherche */}
      <input
        placeholder="Rechercher un élève..."
        className="w-full mt-2 border border-gray-200 rounded-lg
                   px-3 py-2 text-xs focus:outline-none
                   focus:ring-2 focus:ring-blue-300"
      />
    </div>

    {/* Liste conversations */}
    <div className="flex-1 overflow-y-auto">
      {conversations.map(conv => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`w-full flex items-start gap-3 px-4 py-3
                      border-b border-gray-50 transition-colors
                      cursor-pointer text-left
                      ${activeConvId === conv.id
                        ? 'bg-blue-50 border-l-4 border-l-[#1a2744]'
                        : 'hover:bg-gray-50'
                      }`}
        >
          {/* Avatar avec indicateur en ligne */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-100
                            flex items-center justify-center
                            text-blue-800 font-bold text-sm">
              {conv.contactName.charAt(0)}
            </div>
            {conv.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3
                              rounded-full bg-green-400
                              border-2 border-white" />
            )}
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-800 truncate">
                {conv.contactName}
              </span>
              <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
                {conv.lastTime}
              </span>
            </div>
            {/* Rôle (Élève · niveau ou Parent) */}
            <p className="text-xs text-blue-500 mb-0.5">{conv.contactRole}</p>
            <p className="text-xs text-gray-400 truncate">
              {conv.lastMessage}
            </p>
          </div>

          {/* Badge non lus */}
          {conv.unreadCount > 0 && (
            <div className="w-5 h-5 rounded-full bg-[#1a2744]
                            flex items-center justify-center
                            text-white text-xs font-bold flex-shrink-0">
              {conv.unreadCount}
            </div>
          )}
        </button>
      ))}
    </div>
  </div>
);

export default TutorConversationList;