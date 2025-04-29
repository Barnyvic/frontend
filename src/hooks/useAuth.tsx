import { createContext, useContext, useState, ReactNode } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { AuthResponse, LoginInput, RegisterInput, User } from "../types/auth";

const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
    }
  }
`;

const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      id
      username
      createdAt
      updatedAt
    }
  }
`;

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [loginMutation] = useMutation<{ login: AuthResponse }>(LOGIN);
  const [registerMutation] = useMutation<{ register: User }>(REGISTER);

  const login = async (input: LoginInput) => {
    const { data } = await loginMutation({
      variables: { input },
    });
    if (data) {
      localStorage.setItem("token", data.login.access_token);
      setToken(data.login.access_token);
    }
  };

  const register = async (input: RegisterInput) => {
    const { data } = await registerMutation({
      variables: { input },
    });
    if (data) {
      setUser(data.register);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
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
