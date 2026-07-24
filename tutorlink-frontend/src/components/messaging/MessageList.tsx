import { Message } from '../../types/messaging.types';
import MessageBubble from './MessageBubble';

interface Props {
  messages: Message[];
  contactInitial: string;
}

// Regroupe les messages consécutifs du même expéditeur, comme dans une
// vraie app de messagerie : espacement resserré à l'intérieur d'un groupe,
// heure/statut affichés une seule fois (sur le dernier message du groupe),
// avatar affiché une seule fois à côté du dernier message reçu d'un groupe.
const MessageList = ({ messages, contactInitial }: Props) => {
  return (
    <>
      {messages.map((msg, i) => {
        const prev = messages[i - 1];
        const next = messages[i + 1];
        const isFirstInGroup = !prev || prev.isOwn !== msg.isOwn;
        const isLastInGroup = !next || next.isOwn !== msg.isOwn;

        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            isFirstInGroup={isFirstInGroup}
            isLastInGroup={isLastInGroup}
            showAvatar={!msg.isOwn && isLastInGroup}
            contactInitial={contactInitial}
          />
        );
      })}
    </>
  );
};

export default MessageList;
