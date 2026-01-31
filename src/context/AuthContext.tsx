import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, User, fetchUserById } from "../lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "@auth_token";
const AUTH_USER_KEY = "@auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved auth state on mount
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const savedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const savedUser = await AsyncStorage.getItem(AUTH_USER_KEY);
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to load auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await loginUser({ username, password });
      setToken(response.token);

      // FakeStoreAPI doesn't return user info on login, so we fetch user 1 as demo
      // In a real app, you'd decode the JWT or have a /me endpoint
      const userData = await fetchUserById(1);
      setUser(userData);

      // Persist auth state
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
