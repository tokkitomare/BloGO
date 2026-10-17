import { useEffect, useRef, useState } from "react";
import type { Topic } from "../../../types";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (topic: Topic) => void;
}

function loadTopics(): Topic[] {
    try {
        const parsed = JSON.parse(localStorage.getItem("topics") ?? "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

const iconProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

const iconButton = `size-10 shrink-0 flex items-center justify-center rounded-full bg-white/20 cursor-pointer
    transition-colors duration-150 motion-reduce:transition-none
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`;

export default function ManageTopicsModal({ isOpen, onClose, onEdit }: ModalProps) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    // Recarrega a lista sempre que o modal abre
    useEffect(() => {
        if (!isOpen) return;
        setTopics(loadTopics());
        setConfirmingId(null);
        closeRef.current?.focus();
    }, [isOpen]);

    // Fecha com Esc
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose]);

    function deleteTopic(id: string) {
        const updated = topics.filter((item) => item.id !== id);
        localStorage.setItem("topics", JSON.stringify(updated));
        setTopics(updated);
        setConfirmingId(null);
    }

    return (
        <>
            {/* Fundo */}
            <div
                onClick={onClose}
                aria-hidden="true"
                className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm
                transition-opacity duration-300 motion-reduce:transition-none
                ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />

            {/* Janela */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="manage-topics-title"
                aria-hidden={!isOpen}
                className={`fixed top-1/2 left-1/2 z-50 -translate-x-1/2
                flex flex-col gap-5
                w-[min(95vw,48rem)] max-h-[92dvh] p-5 sm:p-8
                bg-black/45 backdrop-blur-md border border-white/45 shadow-glow-5 text-white
                rounded-tl-3xl rounded-br-3xl
                transition duration-200 ease-out motion-reduce:transition-none
                ${isOpen
                    ? "-translate-y-1/2 opacity-100"
                    : "translate-y-full opacity-0 invisible pointer-events-none"}`}
            >
                {/* Cabeçalho */}
                <div className="flex items-center justify-between gap-4 shrink-0">
                    <div className="leading-tight">
                        <h2 id="manage-topics-title" className="font-huninn text-2xl">
                            Gerenciar tópicos
                        </h2>
                        <p className="text-sm text-white/70" aria-live="polite">
                            {topics.length === 0
                                ? "Nenhum tópico"
                                : topics.length === 1
                                  ? "1 tópico"
                                  : `${topics.length} tópicos`}
                        </p>
                    </div>

                    <button
                        ref={closeRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar"
                        className={`${iconButton} bg-white/30 hover:bg-white/45 hover:rotate-90 motion-reduce:hover:rotate-0`}
                    >
                        <svg {...iconProps}>
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                {/* Lista */}
                <div className="flex-1 min-h-40 overflow-y-auto pr-1 scrollbar-thumb-white!">
                    {topics.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center gap-1 text-center py-10">
                            <p className="font-huninn text-lg">Nenhum tópico adicionado</p>
                            <p className="text-sm text-white/70">
                                Feche esta janela e use "Adicionar tópico" para criar o primeiro.
                            </p>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-3">
                            {topics.map((topic) => {
                                const confirming = confirmingId === topic.id;
                                return (
                                    <li
                                        key={topic.id}
                                        className="flex items-center gap-3 bg-glass rounded-2xl px-4 py-3"
                                    >
                                        <div className="min-w-0 flex-1 leading-tight">
                                            <p className="truncate font-bold">{topic.title}</p>
                                            {topic.description && (
                                                <p className="truncate text-sm text-white/65">
                                                    {topic.description}
                                                </p>
                                            )}
                                        </div>

                                        {confirming ? (
                                            <>
                                                <span className="text-sm text-white/80 hidden sm:inline">
                                                    Excluir este tópico?
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => deleteTopic(topic.id)}
                                                    className="px-4 h-10 rounded-full bg-white text-black text-sm font-medium cursor-pointer
                                                    transition-opacity hover:opacity-90 motion-reduce:transition-none
                                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                                >
                                                    Excluir
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmingId(null)}
                                                    className="px-4 h-10 rounded-full border border-white/45 text-sm cursor-pointer
                                                    transition-colors hover:bg-white/15 motion-reduce:transition-none
                                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => onEdit(topic)}
                                                    aria-label={`Editar ${topic.title}`}
                                                    className={`${iconButton} hover:bg-white/35`}
                                                >
                                                    <svg {...iconProps}>
                                                        <path d="M12 20h9" />
                                                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
                                                    </svg>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmingId(topic.id)}
                                                    aria-label={`Excluir ${topic.title}`}
                                                    className={`${iconButton} hover:bg-white/35`}
                                                >
                                                    <svg {...iconProps}>
                                                        <path d="M3 6h18" />
                                                        <path d="M8 6V4h8v2" />
                                                        <path d="M19 6l-1 14H6L5 6" />
                                                        <path d="M10 11v5" />
                                                        <path d="M14 11v5" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Rodapé */}
                <div className="flex justify-end shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="font-huninn px-8 py-2.5 rounded-tl-2xl rounded-br-2xl bg-gradient-light text-black cursor-pointer
                        transition duration-150 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </>
    );
}