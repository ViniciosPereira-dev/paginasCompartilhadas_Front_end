"use client";

import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  BookmarkIcon,
  XMarkIcon,
  InboxArrowDownIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useAuth } from "../contexts/AuthContext";
import { ConfirmModal } from "./ConfirmModal";

const products = [
  {
    name: "Doar um livro",
    description: "Compartilhe conhecimento com outros usuários",
    href: "/books/create", // Link para a página de criação de livro
    icon: BookOpenIcon,
  },
  {
    name: "Explorar livros disponíveis",
    description: "Descubra novos livros para leitura ou troca",
    href: "/catalog", // Link para a página de biblioteca do usuário
    icon: MagnifyingGlassIcon,
  },
  {
    name: "Minha Biblioteca",
    description: "Gerencie seus livros favoritos e adicionados",
    href: "/library",
    icon: BookmarkIcon,
  },
  {
    name: "Solicitações & Requisições",
    description: "Acompanhe pedidos de troca e doação",
    href: "/requests",
    icon: InboxArrowDownIcon,
  },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAutenticado, nomeUsuario, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navegarERolar = (e: React.MouseEvent, secaoId: string) => {
    e.preventDefault();

    if (location.pathname === "/") {
      // Se já está na Home, rola suavemente para a seção na hora
      const elemento = document.getElementById(secaoId);
      if (elemento) {
        elemento.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Se está em outra página (como /catalog), joga para a Home primeiro
      navigate("/");

      // Aguarda um pequeno milissegundo para a Home carregar e faz a rolagem
      setTimeout(() => {
        const elemento = document.getElementById(secaoId);
        if (elemento) {
          elemento.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link
            to="/"
            onClick={(e) => navegarERolar(e, "hero")}
            className="-m-1.5 flex items-center gap-2 p-1.5 focus:outline-none"
          >
            <span className="sr-only">Páginas Compartilhadas</span>
            <BookOpenIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Páginas Compartilhadas
            </span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a
            href="#hero"
            onClick={(e) => navegarERolar(e, "hero")}
            className="text-sm/6 font-semibold text-gray-900 dark:text-white hover:text-indigo-300 transition"
          >
            Home
          </a>

          <a
            href="#livros-disponiveis"
            onClick={(e) => navegarERolar(e, "livros-disponiveis")}
            className="text-sm/6 font-semibold text-gray-900 dark:text-white hover:text-indigo-300 transition"
          >
            Livros
          </a>

          <a
            href="#sobre"
            onClick={(e) => navegarERolar(e, "sobre")}
            className="text-sm/6 font-semibold text-gray-900 dark:text-white hover:text-indigo-300 transition"
          >
            Sobre nós
          </a>

          <Popover className="relative">
            <PopoverButton className="cursor-pointer flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 dark:text-white hover:text-indigo-300 transition ">
              Livros
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 flex-none text-gray-400 dark:text-gray-500"
              />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
            >
              <div className="p-4">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white dark:bg-gray-700/50 dark:group-hover:bg-gray-700">
                      <item.icon
                        aria-hidden="true"
                        className="size-6 text-gray-600 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-white"
                      />
                    </div>
                    <div className="flex-auto">
                      <a
                        href={item.href}
                        className="block font-semibold text-gray-900 dark:text-white"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-x-6">
          {isAutenticado ? (
            <>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Olá,{" "}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {nomeUsuario}
                </span>
              </span>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-sm font-semibold p-2 px-4 rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm/6 font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-indigo-600 text-white p-2 px-4 rounded-md hover:bg-indigo-500 transition-colors"
              >
                Criar Conta
              </Link>
            </>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        {/* BACKDROP (corrigido) */}
        <div className="fixed inset-0 z-40 bg-black/30" />

        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-gray-100/10">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Menu
            </span>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-400"
            >
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
              {/* LINKS PRINCIPAIS */}
              <div className="space-y-2 py-6">
                <a
                  href="#hero"
                  onClick={(e) => {
                    navegarERolar(e, "hero");
                    setMobileMenuOpen(false);
                  }}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Home
                </a>

                <a
                  href="#livros-disponiveis"
                  onClick={(e) => {
                    navegarERolar(e, "livros-disponiveis");
                    setMobileMenuOpen(false);
                  }}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Livros
                </a>

                <a
                  href="#sobre"
                  onClick={(e) => {
                    navegarERolar(e, "sobre");
                    setMobileMenuOpen(false);
                  }}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Sobre nós
                </a>
              </div>

              {/* 🔥 NOVO: MENU LIVROS (ANTES FALTAVA ISSO) */}
              <div className="space-y-2 py-6">
                <p className="px-3 text-xs font-bold uppercase text-gray-400">
                  Ações com livros
                </p>

                {products.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 flex items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                  >
                    <item.icon className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p>{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* AUTH */}
              <div className="py-6">
                {isAutenticado ? (
                  <div className="space-y-2">
                    <p className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 dark:text-white">
                      Olá, {nomeUsuario}
                    </p>

                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="text-sm font-semibold p-2 px-4 rounded-md bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                    >
                      Log in
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-indigo-600 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      Criar Conta
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

      <ConfirmModal
        open={showLogoutModal}
        title="Sair da conta"
        message="Tem certeza que deseja encerrar sua sessão?"
        confirmText="Sair"
        cancelText="Cancelar"
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout();
          setShowLogoutModal(false);
        }}
      />
    </header>
  );
}
