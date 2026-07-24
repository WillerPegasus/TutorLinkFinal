import adminApi from './adminApi';

// Passe par AdminUserProxyController côté api-gateway (@RequestMapping("/api/admin/users")).
// ⚠️ FIX — '/users' (sans préfixe /admin) tombait sur la route publique
// user-service, qui n'accepte pas un token admin → 401.
const adminUserService = {

  // GET /admin/users — liste de tous les utilisateurs
  getAllUsers: async () => {
    const res = await adminApi.get('/admin/users');
    return res.data;
  },

  // DELETE /admin/users/:userId — supprime définitivement un compte
  deleteUser: async (userId: number) => {
    const res = await adminApi.delete(`/admin/users/${userId}`);
    return res.data;
  },
};

export default adminUserService;
