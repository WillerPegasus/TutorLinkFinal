import api from './api';

const messagingService = {
  // GET /messages/conversations/:userId
  getConversations: async (userId: number) => {
    const res = await api.get(`/messages/conversations/${userId}`);
    return res.data;
  },

  // GET /messages/conversation/:userA/:userB
  getConversationHistory: async (userA: number, userB: number) => {
    const res = await api.get(`/messages/conversation/${userA}/${userB}`);
    return res.data;
  },

  // POST /messages/send
  sendMessage: async (senderId: number, receiverId: number, content: string) => {
    const res = await api.post('/messages/send', { senderId, receiverId, content });
    return res.data;
  },

  // PATCH /messages/:messageId/read
  markAsRead: async (messageId: number) => {
    const res = await api.patch(`/messages/${messageId}/read`);
    return res.data;
  },
};

export default messagingService;
