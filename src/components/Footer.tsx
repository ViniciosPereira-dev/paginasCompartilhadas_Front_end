"use client";

import { BookOpenIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="h-8 w-8 text-indigo-600" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Páginas Compartilhadas
              </span>
            </div>

            <p className="mt-4 max-w-md text-sm text-gray-600 dark:text-gray-400">
              Plataforma para conectar leitores através da doação,
              troca e compartilhamento de livros. Compartilhe conhecimento,
              descubra novas leituras e ajude a construir uma comunidade de leitores.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Navegação
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition dark:text-gray-400 "
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition dark:text-gray-400 "
                >
                  Livros
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition    dark:text-gray-400"
                >
                  Sobre Nós
                </a>
              </li>
            </ul>
          </div>

          {/* Conta */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Conta
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition    dark:text-gray-400"
                >
                  Criar Conta
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition    dark:text-gray-400"
                >
                  Login <span aria-hidden="true">&rarr;</span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition    dark:text-gray-400"
                >
                  Minha Biblioteca
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Contato
            </h3>

            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <EnvelopeIcon className="h-5 w-5 flex-shrink-0" />
                contato@paginascompartilhadas.com
              </li>
            </ul>

            <p className="mt-6 text-sm font-medium text-gray-900 dark:text-white">
              Siga-nos
            </p>

            <div className="mt-3 flex items-center gap-4">
              <a
                href="#"
                aria-label="GitHub"
                className="text-gray-500 transition hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              >
                <FaGithub className="h-5 w-5" />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-500 transition hover:text-pink-500 dark:text-gray-400"
              >
                <FaInstagram className="h-5 w-5" />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-500 transition hover:text-blue-600 dark:text-gray-400"
              >
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Linha inferior */}
        <div className="mt-10 border-t border-gray-200 pt-6 dark:border-white/10">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Páginas Compartilhadas. Todos os direitos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}