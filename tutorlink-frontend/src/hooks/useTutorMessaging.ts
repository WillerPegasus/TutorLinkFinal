import { useState, useRef, useEffect, useCallback } from 'react';
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

function resolveOtherParticipant(c: any, myId: number): number {
  return Number(c.participantOneId) === Number(myId)
    ? Number(c.participantTwoId)
    : Number(c.participantOneId);
}

export const useTutorMessaging = () => {
  const { user } = useAuthStore();
  const myId = user ? Number(user.id) : null;

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
            contactRole: 'Élève',
            lastMessage: c.lastMessage ?? '',
            lastTime: formatTime(c.lastMessageAt),
            unreadCount: c.unreadCount ?? 0,
            isOnline: false,
          } as Conversation;
        })
      );
      setConversations(enriched);
      if (enriched.length > 0 && !activeConvId) {
        setActiveConvId(enriched[0].id);
        setActiveContactId(Number(enriched[0].contactId));
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

  useEffect(() => {
    if (!myId || activeContactId === null) return;
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
  }, [myId, activeContactId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Temps réel — absent avant ce fix : le tuteur ne recevait aucun
  // message en direct, seulement au rechargement de la page. ──
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
