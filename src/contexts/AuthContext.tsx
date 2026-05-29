import React, { createContext, useState, useEffect, useContext } from "react";

interface AuthContextType {
  isAutenticado: boolean;
  nomeUsuario: string | null;
  idUsuario: number | null; 
  login: (token: string, nome: string, id: number) => void; 
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);
  const [isAutenticado, setIsAutenticado] = useState(false);

  // Assim que o app carrega, verifica se já tem alguém logado no navegador
  useEffect(() => {
    const token = localStorage.getItem("token_biblioteca");
    const nome = localStorage.getItem("nome_usuario");
    const id = localStorage.getItem("id_usuario");
    if (token && nome && id) {
      setIsAutenticado(true);
      setNomeUsuario(nome);
      setIdUsuario(parseInt(id));
    }
  }, []);

  const login = (token: string, nome: string, id: number) => {
    localStorage.setItem("token_biblioteca", token);
    localStorage.setItem("nome_usuario", nome);
    localStorage.setItem("id_usuario", id.toString());
    setNomeUsuario(nome);
    setIdUsuario(id);
    setIsAutenticado(true);
  };

  const logout = () => {
    localStorage.removeItem("token_biblioteca");
    localStorage.removeItem("nome_usuario");
    localStorage.removeItem("id_usuario");
    setNomeUsuario(null);
    setIdUsuario(null);
    setIsAutenticado(false);
  };

  return (
    <AuthContext.Provider value={{ isAutenticado, nomeUsuario, idUsuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
    