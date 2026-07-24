import { useTutorMessaging } from '../../hooks/useTutorMessaging';

// Réutilise les composants génériques de la messagerie élève
import MessageList from '../../components/messaging/MessageList';
import ChatInput from '../../components/messaging/ChatInput';

// Composants spécifiques répétiteur
import TutorConversationList from '../../components/tutor/messaging/TutorConversationList';
import TutorChatHeader from '../../components/tutor/messaging/TutorChatHeader';

const TutorMessagingPage = () => {
  const {
    conversations, messages,
    activeConvId, activeConversation,
    inputText, setInputText,
    messagesEndRef,
    handleSelectConversation,
    handleSendMessage,
  } = useTutorMessaging();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Liste conversations — colonne gauche */}
      <TutorConversationList
        conversations={conversations}
        activeConvId={activeConvId}
        onSelect={handleSelectConversation}
      />

      {/* Zone de chat — colonne droite */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* En-tête contact actif */}
        {activeConversation && (
          <TutorChatHeader conversation={activeConversation} />
        )}

        {/* Zone messages scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-300 text-sm">
                Aucun message dans cette conversation
              </p>
            </div>
          ) : (
            <MessageList
              messages={messages}
              contactInitial={(activeConversation?.contactName ?? '?').charAt(0).toUpperCase()}
            />
          )}
          {/* Ref scroll automatique */}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone saisie — réutilise le composant élève */}
        <ChatInput
          value={inputText}
          onChange={setInputText}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default TutorMessagingPage;