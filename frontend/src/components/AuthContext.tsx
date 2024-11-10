import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  access_token: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  access_token: null,
  setToken: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [access_token, setToken] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ access_token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
