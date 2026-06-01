import { Dialog } from "@headlessui/react";

type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title = "Confirmação",
  message = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onClose={onCancel} className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

      {/* Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-gray-900 p-6 shadow-xl border border-white/10">
          
          <Dialog.Title className="text-lg font-bold text-white">
            {title}
          </Dialog.Title>

          <p className="mt-2 text-sm text-gray-400">
            {message}
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md text-sm font-semibold text-gray-300 hover:bg-white/10"
            >
              {cancelText}
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-500"
            >
              {confirmText}
            </button>
          </div>

        </Dialog.Panel>
      </div>
    </Dialog>
  );
}