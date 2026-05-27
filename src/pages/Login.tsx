import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { ApiResponse } from "../types/api";
import type { LoginResponseData } from "../types/auth";
import { useAuth } from "../contexts/AuthContext";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);


    try {

      const response = await api.post<ApiResponse<LoginResponseData>>("/users/login", {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data.data;

        localStorage.setItem("token_biblioteca", token);
        localStorage.setItem("nome_usuario", user.name);
        
        login(token, user.name); 
        alert(`Bem-vindo de volta, ${user.name}!`);
        

        navigate("/"); 
      }
    } catch (error: any) {

      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Erro ao tentar realizar o login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Acessar Minha Conta</h2>

      {errorMessage && (
        <div style={{ color: "red", backgroundColor: "#ffebee", padding: "10px", marginBottom: "15px", borderRadius: "4px" }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          style={{ padding: "10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {isLoading ? "Autenticando..." : "Entrar"}
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}>
        Não tem uma conta ainda? <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => navigate("/register")}>Cadastre-se</span>
      </p>
    </div>
  );
};
