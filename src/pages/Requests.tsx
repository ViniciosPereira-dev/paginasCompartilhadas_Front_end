import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { formatPhoneToWhatsApp } from "../utils/phone";
import type { ApiResponse } from "../types/api";
import type { RequestModel } from "../types/request";
import { Toast } from "../components/Toast";

export const Requests: React.FC = () => {
  const { idUsuario } = useAuth();

  console.log("ID USUARIO LOGADO:", idUsuario);

  const [abaAtiva, setAbaAtiva] = useState<"recebidos" | "enviados">(
    "recebidos",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [pedidosRecebidos, setPedidosRecebidos] = useState<RequestModel[]>([]);
  const [pedidosEnviados, setPedidosEnviados] = useState<RequestModel[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);

  const buscarSolicitacoes = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await api.get<ApiResponse<RequestModel[]>>("/requests");

      console.log(JSON.stringify(response.data.data[0], null, 2));

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        const todasAsRequests = response.data.data;

        console.log("REQUESTS API:", response.data);
        console.log("TODAS REQUESTS:", todasAsRequests);
        console.log("ID USUARIO:", idUsuario);

        const recebidos = todasAsRequests.filter((req) => {
          return req.book?.userId === idUsuario;
        });

        const enviados = todasAsRequests.filter((req) => {
          return req.userId === idUsuario;
        });

        console.log("QTD RECEBIDOS:", recebidos.length);
        console.log("QTD ENVIADOS:", enviados.length);

        console.log("RECEBIDOS:", recebidos);
        console.log("ENVIADOS:", enviados);

        setPedidosRecebidos(recebidos);
        setPedidosEnviados(enviados);

        console.log("SET RECEBIDOS", recebidos);
        console.log("SET ENVIADOS", enviados);
      } else {
        setPedidosRecebidos([]);
        setPedidosEnviados([]);
      }
    } catch (error: any) {
      console.error("Erro ao carregar solicitações:", error);

      setErrorMessage("Nenhum histórico de pedidos encontrado.");
      setPedidosRecebidos([]);
      setPedidosEnviados([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (idUsuario) {
      buscarSolicitacoes();
    }
  }, [idUsuario]);

  const handleAceitarPedido = async (requestId: number) => {
    try {
      const response = await api.post(`/requests/accept/${requestId}`);

      if (response.data?.success) {
        setToast({
          type: "success",
          message: "Solicitação aceita!",
        });

        buscarSolicitacoes();
      }
    } catch (error) {
      setToast({
        type: "error",
        message: "Não foi possível aceitar a solicitação.",
      });
    }
  };

  const handleRecusarPedido = async (requestId: number) => {
    const confirmar = window.confirm(
      "Tem certeza que deseja recusar este pedido?",
    );

    if (!confirmar) return;

    try {
      const response = await api.post(`/requests/reject/${requestId}`);

      if (response.data?.success) {
        setToast({
          type: "success",
          message: "Solicitação recusada.",
        });
        buscarSolicitacoes();
      }
    } catch (error) {
      console.error("Erro ao recusar pedido:", error);
      setToast({
        type: "error",
        message: "Não foi possível recusar a solicitação.",
      });
    }
  };

  const handleConcluirDoacao = async (requestId: number, p0: number) => {
    const confirmar = window.confirm("Confirma a finalização da doação?");

    if (!confirmar) return;

    try {
      const response = await api.post(`/requests/finalize/${requestId}`);

      if (response.data?.success) {
        setToast({
          type: "success",
          message: "Doação finalizada com sucesso!",
        });
        buscarSolicitacoes();
      }
    } catch (error) {
      console.error("Erro ao concluir doação:", error);
      setToast({
        type: "error",
        message: "Não foi possível finalizar a doação.",
      });
    }
  };

  const handleAbrirWhatsApp = (phone: string, nome: string) => {
    const numero = formatPhoneToWhatsApp(phone);

    if (!numero) {
      setToast({
        type: "error",
        message: "Telefone inválido",
      });
      return;
    }

    const telefoneComDDI = `55${numero}`;

    const mensagem = encodeURIComponent(
      `Olá ${nome}, sua solicitação de doação foi recebida. Estou entrando em contato para alinharmos os detalhes da entrega do livro.`
    );

    window.open(`https://wa.me/${telefoneComDDI}?text=${mensagem}`, "_blank");
  };

  console.log("ABA ATIVA:", abaAtiva);
  console.log("STATE RECEBIDOS:", pedidosRecebidos);
  console.log("STATE ENVIADOS:", pedidosEnviados);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* CABEÇALHO */}
        <div className="border-b border-white/10 pb-5">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Solicitações & Requisições
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Acompanhe o andamento dos pedidos de doação e combine as entregas
            com os usuários.
          </p>
        </div>

        {/* ABAS */}
        <div className="border-b border-white/10">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setAbaAtiva("recebidos")}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                abaAtiva === "recebidos"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-400 hover:border-gray-700 hover:text-gray-200"
              }`}
            >
              📥 Pedidos que Recebi ({pedidosRecebidos?.length || 0})
            </button>

            <button
              onClick={() => setAbaAtiva("enviados")}
              className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                abaAtiva === "enviados"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-400 hover:border-gray-700 hover:text-gray-200"
              }`}
            >
              📤 Pedidos que Enviei ({pedidosEnviados?.length || 0})
            </button>
          </nav>
        </div>

        {/* ERRO */}
        {errorMessage && (
          <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20">
            {errorMessage}
          </div>
        )}

        {/* LOADING */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <svg
              className="h-8 w-8 animate-spin text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm text-gray-400">
              Buscando atualizações de pedidos...
            </p>
          </div>
        ) : (
          <div className="mt-6">
            {/* ABA: RECEBIDOS */}
            {abaAtiva === "recebidos" &&
              (!pedidosRecebidos || pedidosRecebidos.length === 0 ? (
                <div className="text-center rounded-2xl border-2 border-dashed border-white/10 py-12 text-gray-400">
                  Nenhum pedido recebido até o momento.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pedidosRecebidos.map((pedido) => (
                    <div
                      key={pedido?.id}
                      className="rounded-xl border border-white/10 bg-gray-800 p-6 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                            {pedido?.book?.genre || "Geral"}
                          </span>
                          <span className="inline-flex items-center rounded-md bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-gray-300 ring-1 ring-inset ring-white/10">
                            {pedido?.status === "PENDING"
                              ? "Pendente"
                              : pedido?.status === "ACCEPTED"
                                ? "Aceito"
                                : pedido?.status === "REJECTED"
                                  ? "Recusado"
                                  : "Concluído"}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white line-clamp-1">
                          {pedido?.book?.title || "Título Indisponível"}
                        </h4>
                        {pedido?.user?.phone && (
                          <p className="text-xs text-gray-400">
                            Telefone:{" "}
                            <strong className="text-gray-200">
                              {pedido.user.phone}
                            </strong>
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        {pedido?.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAceitarPedido(pedido.id)}
                              className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2 text-xs font-semibold text-white transition"
                            >
                              Aceitar
                            </button>

                            <button
                              onClick={() => handleRecusarPedido(pedido.id)}
                              className="flex-1 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white py-2 text-xs font-semibold transition border border-red-500/20"
                            >
                              Recusar
                            </button>
                          </div>
                        )}
                        {pedido?.status === "ACCEPTED" && (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() =>
                                pedido.user.phone &&
                                handleAbrirWhatsApp(
                                  pedido.user.phone,
                                  pedido.user.name,
                                )
                              }
                              className="w-full rounded-lg bg-green-600 hover:bg-green-500 py-2 text-xs font-semibold text-white"
                            >
                              💬 Falar no WhatsApp
                            </button>

                            <button
                              onClick={() =>
                                handleConcluirDoacao(pedido.id, pedido.book.id)
                              }
                              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2 text-xs font-semibold text-white"
                            >
                              ✓ Concluir Doação
                            </button>
                          </div>
                        )}
                        {pedido?.status === "REJECTED" && (
                          <p className="text-xs text-center text-red-400 font-medium">
                            Você recusou esta solicitação.
                          </p>
                        )}
                        {pedido?.status === "FINALIZED" && (
                          <p className="text-xs text-center text-green-400 font-medium">
                            🎉 Doação finalizada com sucesso!
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            {/* ABA: ENVIADOS */}
            {abaAtiva === "enviados" &&
              (!pedidosEnviados || pedidosEnviados.length === 0 ? (
                <div className="text-center rounded-2xl border-2 border-dashed border-white/10 py-12 text-gray-400">
                  Você ainda não fez nenhum pedido de doação.
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pedidosEnviados.map((pedido) => (
                    <div
                      key={pedido?.id}
                      className="rounded-xl border border-white/10 bg-gray-800 p-6 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                            {pedido?.book?.title || "Geral"}
                          </span>
                          <span className="inline-flex items-center rounded-md bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-gray-300 ring-1 ring-inset ring-white/10">
                            {pedido?.status === "PENDING"
                              ? "Pendente"
                              : pedido?.status === "ACCEPTED"
                                ? "Aceito"
                                : pedido?.status === "REJECTED"
                                  ? "Recusado"
                                  : "Concluído"}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white line-clamp-1">
                          {pedido?.book?.title || "Título Indisponível"}
                        </h4>
                        <p className="text-xs text-gray-400">
                          Interessado:{" "}
                          <strong className="text-gray-200">
                            {pedido?.user?.name || "Usuário"}
                          </strong>
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                        {pedido.status === "PENDING" && (
                          <p className="text-center text-yellow-400 text-sm font-medium">
                            ⏳ Aguardando resposta do proprietário
                          </p>
                        )}

                        {pedido.status === "ACCEPTED" && (
                          <p className="text-center text-green-400 text-sm font-medium">
                            ✅ Pedido aceito
                          </p>
                        )}

                        {pedido.status === "REJECTED" && (
                          <p className="text-center text-red-400 text-sm font-medium">
                            ❌ Pedido recusado
                          </p>
                        )}

                        {pedido.status === "FINALIZED" && (
                          <p className="text-center text-green-400 text-sm font-medium">
                            🎉 Doação concluída
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
