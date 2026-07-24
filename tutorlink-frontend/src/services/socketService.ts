import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// ⚠️ Se connecte DIRECTEMENT à message-service (port 8086), pas à la
// gateway (:8080) — la gateway (spring-cloud-gateway-mvc) ne proxy pas
// les connexions WebSocket. VITE_SOCKET_URL doit donc pointer sur 8086.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:8086';

let client: Client | null = null;
const subscriptions = new Map<string, () => void>(); // userId -> unsubscribe

function getClient(): Client {
  if (client) return client;

  client = new Client({
    webSocketFactory: () => new SockJS(`${SOCKET_URL}/ws`),
    reconnectDelay: 3000,
    onStompError: (frame) => {
      console.error('Erreur STOMP:', frame.headers['message'], frame.body);
    },
  });
  client.activate();
  return client;
}

// S'abonne aux messages entrants pour un utilisateur donné.
// Retourne une fonction de désabonnement à appeler au démontage du hook.
export function subscribeToMessages(
  userId: number,
  onMessage: (payload: any) => void
): () => void {
  const key = String(userId);

  // Évite les doubles abonnements (ex: re-render React StrictMode)
  subscriptions.get(key)?.();

  const c = getClient();

  const doSubscribe = () => {
    const sub = c.subscribe(`/topic/messages/${userId}`, (msg: IMessage) => {
      try {
        onMessage(JSON.parse(msg.body));
      } catch (err) {
        console.error('Erreur parsing message WebSocket:', err);
      }
    });
    subscriptions.set(key, () => sub.unsubscribe());
  };

  if (c.connected) {
    doSubscribe();
  } else {
    c.onConnect = doSubscribe;
  }

  return () => {
    subscriptions.get(key)?.();
    subscriptions.delete(key);
  };
}
