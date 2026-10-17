import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";

type ImageSlot = "0" | "1";

export type ImageSlots = Record<ImageSlot, string | null>;

interface Config {
    label?: string | null;
    mainClassName?: string;
    buttonClassName?: string;
    removeClassName?: string;
    imageIndex?: number;
    imageInButton?: boolean;
    storageKey: string;
    maxUploadSize?: number;
    onImageChange: (images: ImageSlots) => void;
}

const EMPTY_IMAGES: ImageSlots = {
    "0": null,
    "1": null,
};

function readImages(storageKey: string): ImageSlots {
    try {
        const stored = localStorage.getItem(storageKey);
        if (!stored) return { ...EMPTY_IMAGES };

        const parsed: unknown = JSON.parse(stored);

        // Compatibilidade com o formato antigo: string[]
        if (Array.isArray(parsed)) {
            return {
                "0": parsed[0] ?? null,
                "1": parsed[1] ?? null,
            };
        }

        if (parsed && typeof parsed === "object") {
            const obj = parsed as Record<string, unknown>;

            return {
                "0": typeof obj["0"] === "string" ? obj["0"] : null,
                "1": typeof obj["1"] === "string" ? obj["1"] : null,
            };
        }
    } catch (error) {
        console.error("Erro ao ler imagens:", error);
    }

    return { ...EMPTY_IMAGES };
}

export default function ImageUploader({
    label = "",
    mainClassName = "flex flex-col gap-3 lg:flex-1",
    buttonClassName = `relative flex flex-col items-center justify-center gap-1 w-full aspect-3/2
        rounded-2xl shadow-lg text-neutral-700 disabled:cursor-not-allowed
        disabled:opacity-70 px-5 py-4 font-huninn leading-tight resize-none overflow-hidden
        bg-black/5 border-2 border-black placeholder:text-black/40 selection:bg-black`,
    removeClassName = "font-hunnin",
    imageIndex = 0,
    imageInButton = true,
    storageKey,
    maxUploadSize = 2 * 1024 * 1024,
    onImageChange,
}: Config) {
    const slot: ImageSlot = imageIndex === 1 ? "1" : "0";

    const [image, setImage] = useState<string | null>(
        () => readImages(storageKey)[slot]
    );

    useEffect(() => {
        function syncImage() {
            const images = readImages(storageKey);
            setImage(images[slot]);
        }

        // Sincroniza ao montar e quando a configuração muda.
        syncImage();

        // Sincroniza quando o modal limpa as imagens.
        window.addEventListener("images-cleared", syncImage);

        return () => {
            window.removeEventListener("images-cleared", syncImage);
        };
    }, [storageKey, slot]);

    function updateSlot(value: string | null) {
        const images = readImages(storageKey);

        const updated: ImageSlots = {
            ...images,
            [slot]: value,
        };

        localStorage.setItem(storageKey, JSON.stringify(updated));
        setImage(value);
        onImageChange(updated);
    }

    function handleImageChange(ev: ChangeEvent<HTMLInputElement>) {
        const input = ev.currentTarget;
        const file = input.files?.[0];

        if (!file) return;

        const allowedTypes = new Set([
            "image/png",
            "image/jpeg",
            "image/avif",
            "image/svg+xml",
        ]);

        const allowedExtensions = /\.(png|jpe?g|avif|svg)$/i;

        if (
            !allowedExtensions.test(file.name) ||
            !allowedTypes.has(file.type) ||
            file.size > maxUploadSize
        ) {
            input.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result !== "string") return;

            updateSlot(reader.result);
            input.value = "";
        };

        reader.onerror = () => {
            console.error("Erro ao ler imagem");
            input.value = "";
        };

        reader.readAsDataURL(file);
    }

    function removeImage() {
        if (image === null) return;
        updateSlot(null);
    }

    return (
        <div className={mainClassName}>
            {label && <p className="text-sm font-medium">{label}</p>}

            <button
                type="button"
                title="Adicionar imagem"
                aria-label="Adicionar imagem"
                className={buttonClassName}
            >
                <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.avif,.svg"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    onChange={handleImageChange}
                />

                {image && imageInButton ? (
                    <img
                        src={image}
                        alt={`Imagem ${Number(slot) + 1}`}
                        className="absolute inset-0 w-full h-full object-contain"
                    />
                ) : (
                    <>
                        <span className="text-4xl font-light leading-none">+</span>
                        <span className="text-xs">Adicionar imagem</span>
                    </>
                )}
            </button>

            {image && imageInButton && (
                <button
                    type="button"
                    className={removeClassName}
                    onClick={removeImage}
                >
                    Remover
                </button>
            )}
        </div>
    );
}
