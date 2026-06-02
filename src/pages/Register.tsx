import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import type { ApiResponse } from "../types/api";
import { BookOpenIcon } from "lucide-react";

export const Register: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setShowSuccess(false);
    setIsLoading(true);

    const telefoneLimpo = phone.replace(/\D/g, "");

    if (name.trim().length < 3) {
      setErrorMessage("O nome deve ter pelo menos 3 caracteres.");
      setIsLoading(false);
      return;
    }

    if (Number(age) < 12) {
      setErrorMessage("A idade mínima para cadastro é 12 anos.");
      setIsLoading(false);
      return;
    }

    if (telefoneLimpo.length !== 11) {
      setErrorMessage("Informe um telefone válido com DDD.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage("A senha deve possuir pelo menos 8 caracteres.");
      setIsLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "A senha deve conter letra maiúscula, minúscula, número e caractere especial.",
      );
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    const userData = {
      name,
      email,
      password,
      age: Number(age),
      gender,
      phone: telefoneLimpo,
    };

    try {
      const response = await api.post<ApiResponse<any>>("/users", userData);

      if (response.data.success) {
        setShowSuccess(true);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
        <BookOpenIcon className="h-10 w-10 text-indigo-500" />
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-white">
          Criar nova conta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {showSuccess && (
          <div className="mb-6 rounded-md bg-emerald-500/10 p-4 border border-emerald-500/20 flex items-start gap-3 dynamic-fade-in">
            <svg
              className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-emerald-400">
                Conta criada!
              </h3>
              <p className="text-xs text-emerald-500/90 mt-0.5">
                Redirecionando para a tela de login...
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-md bg-red-500/10 p-4 border border-red-500/20 flex items-start gap-3">
            <svg
              className="h-5 w-5 text-red-400 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-sm text-red-400">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome Completo */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Nome Completo
            </label>
            <div className="mt-2">
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Endereço de E-mail
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Senha
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Confirmar Senha
            </label>

            <div className="mt-2">
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          {confirmPassword && (
            <p
              className={`mt-1 text-xs ${
                password === confirmPassword ? "text-green-400" : "text-red-400"
              }`}
            >
              {password === confirmPassword
                ? "✓ As senhas coincidem"
                : "✗ As senhas não coincidem"}
            </p>
          )}

          <p className="mt-1 text-xs text-gray-400">
            A senha deve possuir pelo menos 8 caracteres, incluindo: letra
            maiúscula, letra minúscula, número e caractere especial.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="age"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Idade
              </label>
              <div className="mt-2">
                <input
                  id="age"
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ex: 25"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Gênero
              </label>
              <div className="mt-2">
                <select
                  id="gender"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="block w-full rounded-md bg-white/5 px-3 py-[7px] text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6 [&>option]:bg-gray-800"
                >
                  <option value="" disabled hidden>
                    Selecione
                  </option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Telefone
            </label>
            <div className="mt-2">
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => {
                  let valor = e.target.value.replace(/\D/g, "");

                  if (valor.length > 11) {
                    valor = valor.slice(0, 11);
                  }

                  valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
                  valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

                  setPhone(valor);
                }}
                placeholder="(15) 99999-9999"
                className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || showSuccess}
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Cadastrando..."
                : showSuccess
                  ? "Sucesso!"
                  : "Cadastrar"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Já tem uma conta?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-indigo-400 hover:text-indigo-300 bg-transparent border-none p-0 cursor-pointer"
          >
            Faça Login
          </button>
        </p>
      </div>
    </div>
  );
};
