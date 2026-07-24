import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Conversation, Message } from '../types/messaging.types';
import messagingService from '../services/messagingService';
import { resolvePublicProfile } from '../services/publicProfileCache';
import { subscribeToMessages } from '../services/socketService';
import { useAuthStore } from '../store/authStore';

function formatTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'hier';
  if (diffDays < 7) return `${diffDays}j`;
  return `${Math.floor(diffDays / 7)} sem.`;
}

// Résout l'autre participant d'une conversation par rapport à moi.
// ⚠️ Toujours comparer en Number() : le backend peut renvoyer ces id
// en string selon le sérialiseur JSON, et une comparaison === directe
// entre string et number échoue silencieusement — bug qui faisait
// remonter le mauvais contact (parfois soi-même).
function resolveOtherParticipant(c: any, myId: number): number {
  return Number(c.participantOneId) === Number(myId)
    ? Number(c.participantTwoId)
    : Number(c.participantOneId);
}

export const useMessaging = () => {
  const { user } = useAuthStore();
  const myId = user ? Number(user.id) : null;
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    if (!myId) return;
    setLoading(true);
    try {
      const raw = await messagingService.getConversations(myId);
      const enriched = await Promise.all(
        raw.map(async (c: any) => {
          const otherId = resolveOtherParticipant(c, myId);
          const profile = await resolvePublicProfile(otherId);
          return {
            id: String(c.id),
            contactId: String(otherId),
            contactName: profile.name,
            contactRole: 'Répétiteur',
            lastMessage: c.lastMessage ?? '',
            lastTime: formatTime(c.lastMessageAt),
            unreadCount: c.unreadCount ?? 0,
            isOnline: false,
          } as Conversation;
        })
      );

      const contactParam = searchParams.get('contact');
      if (contactParam) {
        const existing = enriched.find(c => c.contactId === contactParam);
        if (existing) {
          setConversations(enriched);
          setActiveConvId(existing.id);
          setActiveContactId(Number(existing.contactId));
        } else {
          const virtual: Conversation = {
            id: `new-${contactParam}`,
            contactId: contactParam,
            contactName: searchParams.get('name') ?? 'Répétiteur',
            contactRole: searchParams.get('role') ?? '',
            lastMessage: '',
            lastTime: '',
            unreadCount: 0,
            isOnline: false,
          };
          setConversations([virtual, ...enriched]);
          setActiveConvId(virtual.id);
          setActiveContactId(Number(contactParam));
          setMessages([]);
        }
      } else {
        setConversations(enriched);
        if (enriched.length > 0 && !activeConvId) {
          setActiveConvId(enriched[0].id);
          setActiveContactId(Number(enriched[0].contactId));
        }
      }
    } catch (err) {
      console.error('Erreur chargement conversations:', err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myId]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  // Charge l'historique quand la conversation active change, et marque
  // comme lus les messages reçus (pas les nôtres) qui ne le sont pas encore.
  useEffect(() => {
    if (!myId || activeContactId === null || activeConvId.startsWith('new-')) return;
    (async () => {
      try {
        const raw = await messagingService.getConversationHistory(myId, activeContactId);
        const mapped: Message[] = raw.map((m: any) => ({
          id: String(m.id),
          senderId: Number(m.senderId) === myId ? 'me' : String(m.senderId),
          content: m.content,
          timestamp: formatTime(m.sentAt),
          status: m.isRead ? 'lu' : 'envoye',
          isOwn: Number(m.senderId) === myId,
        }));
        const seen = new Set<string>();
        setMessages(mapped.filter(m => {
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        }));

        // Marque comme lus les messages reçus non encore lus de cette conv.
        raw
          .filter((m: any) => Number(m.senderId) !== myId && !m.isRead)
          .forEach((m: any) => {
            messagingService.markAsRead(m.id).catch(() => {});
          });
      } catch (err) {
        console.error('Erreur chargement messages:', err);
        setMessages([]);
      }
    })();
  }, [myId, activeContactId, activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!myId) return;
    const unsubscribe = subscribeToMessages(myId, (payload: any) => {
      const fromId = Number(payload.senderId);

      setActiveContactId(current => {
        if (current === fromId) {
          setMessages(prev => {
            const id = String(payload.id);
            if (prev.some(m => m.id === id)) return prev;
            return [...prev, {
              id,
              senderId: String(fromId),
              content: payload.content,
              timestamp: formatTime(payload.sentAt),
              status: 'envoye',
              isOwn: false,
            }];
          });
          // Conversation actuellement ouverte → on marque lu immédiatement
          messagingService.markAsRead(payload.id).catch(() => {});
        }
        return current;
      });

      setConversations(prev => {
        const idx = prev.findIndex(c => Number(c.contactId) === fromId);
        if (idx === -1) {
          loadConversations();
          return prev;
        }
        const updated = [...prev];
        const isOpen = updated[idx].contactId === String(fromId) &&
          document.visibilityState === 'visible';
        updated[idx] = {
          ...updated[idx],
          lastMessage: payload.content,
          lastTime: formatTime(payload.sentAt),
          unreadCount: isOpen ? updated[idx].unreadCount : updated[idx].unreadCount + 1,
        };
        return updated;
      });
    });
    return unsubscribe;
  }, [myId, loadConversations]);

  const handleSelectConversation = (convId: string) => {
    const conv = conversations.find(c => c.id === convId);
    setActiveConvId(convId);
    setActiveContactId(conv ? Number(conv.contactId) : null);
    setInputText('');
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, unreadCount: 0 } : c
    ));
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !myId || activeContactId === null) return;
    const content = inputText.trim();
    setInputText('');
    try {
      const sent = await messagingService.sendMessage(myId, activeContactId, content);
      setMessages(prev => {
        const id = String(sent.id);
        if (prev.some(m => m.id === id)) return prev;
        return [...prev, {
          id,
          senderId: 'me',
          content: sent.content,
          timestamp: formatTime(sent.sentAt),
          status: 'envoye',
          isOwn: true,
        }];
      });
      if (activeConvId.startsWith('new-')) {
        await loadConversations();
      }
    } catch (err) {
      console.error('Erreur envoi message:', err);
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConvId);

  return {
    loading, conversations, messages,
    activeConvId, activeConversation,
    inputText, setInputText,
    messagesEndRef,
    handleSelectConversation,
    handleSendMessage,
  };
};
