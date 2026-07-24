import { useMessaging } from '../../hooks/useMessaging';
import ConversationList from '../../components/messaging/ConversationList';
import ChatHeader from '../../components/messaging/ChatHeader';
import MessageList from '../../components/messaging/MessageList';
import ChatInput from '../../components/messaging/ChatInput';

const MessagingPage = () => {
  const {
    conversations, messages,
    activeConvId, activeConversation,
    inputText, setInputText,
    messagesEndRef,
    handleSelectConversation,
    handleSendMessage,
  } = useMessaging();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Liste des conversations — colonne gauche */}
      <ConversationList
        conversations={conversations}
        activeConvId={activeConvId}
        onSelect={handleSelectConversation}
      />

      {/* Zone de chat — colonne droite */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* En-tête contact actif */}
        {activeConversation && (
          <ChatHeader conversation={activeConversation} />
        )}

        {/* Zone des messages — scrollable */}
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
          {/* Ref pour scroll automatique */}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <ChatInput
          value={inputText}
          onChange={setInputText}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default MessagingPage;