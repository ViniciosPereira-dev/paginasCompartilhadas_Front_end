import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { ApiResponse } from "../types/api";

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const userData = {
      name,
      email,
      password,
      age: Number(age), 
      gender,
      phone,
    };

    try {

      const response = await api.post<ApiResponse<any>>("/users", userData);

      if (response.data.success) {
        alert("Conta criada com sucesso! Redirecionando para o login...");
        navigate("/login"); 
      }
    } catch (error: any) {

      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Erro interno ao conectar com o servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Criar Nova Conta</h2>

      {errorMessage && (
        <div style={{ color: "red", backgroundColor: "#ffebee", padding: "10px", marginBottom: "15px", borderRadius: "4px" }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          placeholder="Nome Completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Idade"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
          <option value="">Selecione o Gênero</option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
          <option value="Outro">Outro</option>
        </select>

        <input
          type="tel"
          placeholder="Telefone (ex: 15999999999)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {isLoading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
      
      <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}>
        Já tem uma conta? <span style={{ color: "#007bff", cursor: "pointer" }} onClick={() => navigate("/login")}>Faça Login</span>
      </p>
    </div>
  );
};
