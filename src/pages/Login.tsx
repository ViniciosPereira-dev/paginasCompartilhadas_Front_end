import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpenIcon } from "@heroicons/react/24/outline";
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
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await api.post<ApiResponse<LoginResponseData>>(
        "/users/login",
        {
          email,
          password,
        },
      );

      if (response.data.success) {
        const { token, user } = response.data.data;

        login(token, user.name, user.id);
        setIsSuccess(true);

        setTimeout(() => {
          navigate("/");
        }, 2000);
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
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900 w-full">
      
      {/* Cabeçalho centralizado */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
        <BookOpenIcon className="h-10 w-10 text-indigo-500" />
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
          Acessar sua conta
        </h2>
        {!isSuccess && (
          <p className="mt-2 text-center text-sm text-gray-400">
            Entre para gerenciar seus livros e doações
          </p>
        )}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {isSuccess ? (
          /* ================= TELA DE TRANSIÇÃO SUAVE ================= */
          <div className="flex flex-col items-center justify-center text-center space-y-5">
            <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-pulse">
              <svg
                className="h-10 w-10 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                Autenticação confirmada!
              </h3>
              <p className="text-sm text-gray-400 max-w-xs">
                Preparando seu ambiente e conectando à sua biblioteca...
              </p>
            </div>

            <div className="w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
              <div className="h-full bg-indigo-500 rounded-full animate-pulse w-full"></div>
            </div>
          </div>
        ) : (
          /* ================= FORMULÁRIO DE LOGIN ================= */
          <>
            {/* Alerta de Erro */}
            {errorMessage && (
              <div className="mb-6 rounded-md bg-red-500/10 p-4 border border-red-500/20 flex items-start gap-3">
                <svg className="h-5 w-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm text-red-400">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* E-mail Input */}
              <div>
                <label htmlFor="email-address" className="block text-sm/6 font-medium text-gray-100">
                  Endereço de e-mail
                </label>
                <div className="mt-2">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  />
                </div>
              </div>

              {/* Senha Input */}
              <div>
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                  Sua senha
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  />
                </div>
              </div>

              {/* Botão de Envio */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-400">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-semibold text-indigo-400 hover:text-indigo-300 bg-transparent border-none p-0 cursor-pointer layout-link"
              >
                Cadastre-se grátis
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );

};
