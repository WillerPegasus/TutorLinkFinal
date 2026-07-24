import { Conversation } from '../../types/messaging.types';

interface Props {
  conversations: Conversation[];
  activeConvId: string;
  onSelect: (id: string) => void;
}

const ConversationList = ({ conversations, activeConvId, onSelect }: Props) => (
  <div className="w-72 bg-white border-r border-gray-100
                  flex flex-col flex-shrink-0">

    {/* En-tête liste */}
    <div className="px-4 py-4 border-b border-gray-100">
      <h3 className="font-bold text-gray-700">💬 Messages</h3>
      {/* Recherche conversation */}
      <input
        placeholder="Rechercher..."
        className="w-full mt-2 border border-gray-200 rounded-lg
                   px-3 py-2 text-xs focus:outline-none
                   focus:ring-2 focus:ring-blue-300"
      />
    </div>

    {/* Liste des conversations */}
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
            <div className="w-10 h-10 rounded-full bg-yellow-400
                            flex items-center justify-center text-sm font-bold">
              {conv.contactName.charAt(0)}
            </div>
            {/* Point vert si en ligne */}
            {conv.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3
                              rounded-full bg-green-400 border-2 border-white" />
            )}
          </div>

          {/* Infos conversation */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-800 truncate">
                {conv.contactName}
              </span>
              <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
                {conv.lastTime}
              </span>
            </div>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {conv.lastMessage}
            </p>
          </div>

          {/* Badge messages non lus */}
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

export default ConversationList;