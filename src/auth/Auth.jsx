import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("spotifyToken"));
    useEffect(() => {
        if (token) {
      localStorage.setItem("spotifyToken", token);
    } else {
      localStorage.removeItem("spotifyToken");
    }
  }, [token]);
   const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };
  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};