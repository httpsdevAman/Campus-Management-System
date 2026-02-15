import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";
import { clearToken } from "../services/authToken";

const AuthContext = createContext(null);

function normalizeUser(u) {
  if (!u) return null;
  return {
    ...u,
    id: u._id || u.id,
    email: u.instituteEmail || u.email || "",
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const u = await authService.me();
      setUser(normalizeUser(u));
    } catch (err) {
      if (err?.status === 401) clearToken();
      try {
        const data = await authService.checkToken();
        setUser(data?.login ? data.data : null);
      } catch {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateUser = () => fetchUser();

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    // Set user from response so redirect works even if /api/auth/me fails (e.g. cookie-only backend)
    if (data?.user) setUser(normalizeUser(data.user));
    else await fetchUser();
  };

  const register = async (email, password) => {
    const data = await authService.register(email, password);
    if (data?.user) setUser(normalizeUser(data.user));
    else await fetchUser();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        updateUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
