import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for the context
interface AuthContextType {
  access_token: string | null;
  user_name: string | null;
  user_id: number | null;
  setToken: (token: string | null) => void;
  setUserName: (name: string | null) => void;
  setUserID: (user_id: number | null) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  access_token: null,
  user_name: null,
  user_id: null,
  setToken: () => {},
  setUserName: () => {},
  setUserID: () => {},

});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [access_token, setToken] = useState<string | null>(null);
  const [user_name, setUserName] = useState<string | null>(null);
  const [user_id, setUserID] = useState<number | null>(null);

  return (
    <AuthContext.Provider value={{ access_token, user_name, user_id, setToken, setUserName, setUserID }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
