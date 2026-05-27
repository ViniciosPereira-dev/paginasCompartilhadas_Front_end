import React, { createContext, useState, useEffect, useContext } from "react";

interface AuthContextType {
  isAutenticado: boolean;
  nomeUsuario: string | null;
  login: (token: string, nome: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);
  const [isAutenticado, setIsAutenticado] = useState(false);

  // Assim que o app carrega, verifica se já tem alguém logado no navegador
  useEffect(() => {
    const token = localStorage.getItem("token_biblioteca");
    const nome = localStorage.getItem("nome_usuario");
    if (token && nome) {
      setIsAutenticado(true);
      setNomeUsuario(nome);
    }
  }, []);

  const login = (token: string, nome: string) => {
    localStorage.setItem("token_biblioteca", token);
    localStorage.setItem("nome_usuario", nome);
    setNomeUsuario(nome);
    setIsAutenticado(true);
  };

  const logout = () => {
    localStorage.removeItem("token_biblioteca");
    localStorage.removeItem("nome_usuario");
    setNomeUsuario(null);
    setIsAutenticado(false);
  };

  return (
    <AuthContext.Provider value={{ isAutenticado, nomeUsuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
