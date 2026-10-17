import { useCallback, useEffect, useRef, useState } from "react";
import type { Topic } from "../../../types";
import ImageUploader, {
    type ImageSlots,
} from "../../../components/ImageUploader";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    topic?: Topic | null;
}

const TITLE_MAX = 50;
const DESC_MAX = 1500;
const STORAGE_KEY = "TopicImages";

const EMPTY_IMAGES: ImageSlots = {
    "0": null,
    "1": null,
};

function loadTopics(): Topic[] {
    try {
        const parsed = JSON.parse(
            localStorage.getItem("topics") ?? "[]"
        );

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function loadImages(): ImageSlots {
    try {
        const parsed = JSON.parse(
            localStorage.getItem(STORAGE_KEY) ?? "{}"
        );

        // Compatibilidade com o formato antigo string[]
        if (Array.isArray(parsed)) {
            return {
                "0": parsed[0] ?? null,
                "1": parsed[1] ?? null,
            };
        }

        return {
            "0": parsed["0"] ?? null,
            "1": parsed["1"] ?? null,
        };
    } catch {
        return { ...EMPTY_IMAGES };
    }
}

export default function CreateTopicModal({
    isOpen,
    onClose,
    topic,
}: ModalProps) {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const titleRef = useRef<HTMLInputElement>(null);

    const isEditing = Boolean(topic);
    const canSave =
        title.trim().length > 0 &&
        desc.trim().length > 0;

    const [images, setImages] = useState<ImageSlots>(loadImages);

    // Carrega os dados ao abrir o modal.
    useEffect(() => {
        if (!isOpen) return;

        setTitle(topic?.title ?? "");
        setDesc(topic?.description ?? "");

        // Ao criar, começa sempre sem imagens.
        // Ao editar, carrega as imagens do tópico.
        if (topic) {
            const topicImages = topic.images as ImageSlots | undefined;

            setImages({
                "0": topicImages?.["0"] ?? null,
                "1": topicImages?.["1"] ?? null,
            });
        } else {
            setImages({ ...EMPTY_IMAGES });
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(EMPTY_IMAGES)
            );
        }

        titleRef.current?.focus();
    }, [isOpen, topic]);

    // Limpa as imagens temporárias.
    const clearImages = useCallback(() => {
        const emptyImages: ImageSlots = { ...EMPTY_IMAGES };

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(emptyImages)
        );

        setImages(emptyImages);

        // Atualiza o estado interno dos ImageUploader.
        window.dispatchEvent(new Event("images-cleared"));
    }, []);

    // Fecha e limpa os campos do formulário.
    const handleClose = useCallback(() => {
        setTitle("");
        setDesc("");
        clearImages();
        onClose();
    }, [clearImages, onClose]);

    // Salva o tópico no localStorage.
    const saveTopic = useCallback((): boolean => {
        if (!canSave) return false;

        const topics = loadTopics();
        const cleanTitle = title.trim();
        const cleanDesc = desc.trim();

        if (topic) {
            const updated = topics.map((t) =>
                t.id === topic.id
                    ? {
                          ...t,
                          title: cleanTitle,
                          description: cleanDesc,
                          images,
                      }
                    : t
            );

            localStorage.setItem(
                "topics",
                JSON.stringify(updated)
            );
        } else {
            const newTopic: Topic = {
                id: crypto.randomUUID(),
                title: cleanTitle,
                description: cleanDesc,
                images,
                postId: null,
            };

            topics.push(newTopic);

            localStorage.setItem(
                "topics",
                JSON.stringify(topics)
            );
        }

        return true;
    }, [canSave, title, desc, topic, images]);

    const handleSave = useCallback(() => {
        if (saveTopic()) {
            handleClose();
        }
    }, [saveTopic, handleClose]);

    // Fecha com Escape.
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose();
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen, handleClose]);

    // Salva com Enter, exceto dentro do textarea.
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (
                e.key !== "Enter" ||
                e.shiftKey ||
                e.isComposing ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            e.preventDefault();
            handleSave();
        };

        window.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen, handleSave]);


    return (
        <>
            {/* Fundo */}
            <div
                onClick={handleClose}
                aria-hidden="true"
                className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm
                transition-opacity duration-300 motion-reduce:transition-none
                ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />

            {/* Janela */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="topic-modal-title"
                aria-hidden={!isOpen}
                className={`fixed top-1/2 left-1/2 z-50 -translate-x-1/2
                flex flex-col gap-5
                w-[min(95vw,64rem)] max-h-[92dvh] p-5 sm:p-8
                bg-black/45 backdrop-blur-md border border-white/45 shadow-glow-5 text-white
                rounded-tl-3xl rounded-br-3xl
                transition duration-200 ease-out motion-reduce:transition-none
                ${isOpen
                        ? "-translate-y-1/2 opacity-100"
                        : "translate-y-full opacity-0 invisible pointer-events-none"}`}
            >
                {/* Cabeçalho */}
                <div className="flex items-center justify-between gap-4 shrink-0">
                    <h2 id="topic-modal-title" className="font-huninn text-2xl">
                        {isEditing ? "Editar tópico" : "Novo tópico"}
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Fechar"
                        className="size-10 flex items-center justify-center rounded-full bg-white/30 cursor-pointer
                        transition duration-150 hover:bg-white/45 hover:rotate-90 motion-reduce:transition-none motion-reduce:hover:rotate-0
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                {/* Título */}
                <div className="flex flex-col gap-2 shrink-0">
                    <div className="flex items-baseline justify-between">
                        <label htmlFor="topic-title" className="text-sm font-medium">
                            Título
                        </label>
                        <span className="text-xs text-white/60 tabular-nums">
                            {title.length}/{TITLE_MAX}
                        </span>
                    </div>
                    <input
                        ref={titleRef}
                        id="topic-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={TITLE_MAX}
                        autoComplete="off"
                        placeholder="Título do tópico"
                        className="w-full px-4 py-3 bg-white/10 border-b-2 border-white rounded-tl-2xl rounded-br-2xl
                        font-huninn text-xl placeholder:text-white/50 selection:bg-white selection:text-black
                        focus:outline-none focus:bg-white/20 transition-colors motion-reduce:transition-none"
                    />
                </div>

                {/* Descrição + imagens */}
                <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-y-auto lg:overflow-visible">
                    <div className="flex flex-col gap-2 lg:w-7/10 min-h-56 lg:min-h-0">
                        <div className="flex items-baseline justify-between">
                            <label htmlFor="topic-description" className="text-sm font-medium">
                                Descrição
                            </label>
                            <span className="text-xs text-white/60 tabular-nums">
                                {desc.length}/{DESC_MAX}
                            </span>
                        </div>
                        <textarea
                            id="topic-description"
                            name="description"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            maxLength={DESC_MAX}
                            placeholder="Descreva sobre seu tópico (suporta markdown)"
                            className="flex-1 w-full min-h-0 p-4 resize-none text-sm leading-relaxed
                            bg-white/10 border border-white/30 shadow-glow-3 rounded-b-2xl rounded-tr-2xl
                            placeholder:text-white/50 scrollbar-thumb-white!
                            focus:outline-none focus:bg-white/20 focus:border-white/60
                            transition-colors motion-reduce:transition-none"
                        />
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-1">
                        <p className="text-sm font-medium">Imagens</p>

                        <div className="grid grid-cols-2 gap-3">
                            <ImageUploader
                                buttonClassName="relative overflow-hidden flex flex-col
    items-center justify-center gap-1 w-full aspect-3/2 rounded-2xl
    bg-white/10 border border-white/30 shadow-glow-3 text-white/60
    disabled:cursor-not-allowed disabled:opacity-70"
                                storageKey={STORAGE_KEY}
                                maxUploadSize={1024 * 1024}
                                removeClassName="bg-white/10 border border-white/30 shadow-glow-3 rounded-md cursor-pointer"
                                imageIndex={0}
                                onImageChange={setImages}
                            />

                            <ImageUploader
                                buttonClassName="relative overflow-hidden flex flex-col
    items-center justify-center gap-1 w-full aspect-3/2 rounded-2xl
    bg-white/10 border border-white/30 shadow-glow-3 text-white/60
    disabled:cursor-not-allowed disabled:opacity-70"
                                storageKey={STORAGE_KEY}
                                maxUploadSize={1024 * 1024}
                                removeClassName="bg-white/10 border border-white/30 shadow-glow-3 rounded-md cursor-pointer"
                                imageIndex={1}
                                onImageChange={setImages}
                            />
                        </div>
                    </div>
                </div>

                {/* rodape */}
                <div className="flex items-center justify-start gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-2.5 rounded-tl-2xl rounded-br-2xl border border-white/45 cursor-pointer
                        transition-colors hover:bg-white/15 motion-reduce:transition-none
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!canSave}
                        className="font-huninn px-8 py-2.5 rounded-tl-2xl rounded-br-2xl bg-gradient-light text-black cursor-pointer
                        transition duration-150 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                        disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </>
    );
}