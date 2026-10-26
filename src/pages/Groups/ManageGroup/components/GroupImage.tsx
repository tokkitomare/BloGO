import { useState } from "react";
import { getImages } from "../../GroupCreate/utils/getImages";

interface Props {
    newSelectedImage: string,
    setNewSelectedImage: (v: string) => void;
}

export default function ({
    newSelectedImage,
    setNewSelectedImage,
}: Props) {
    const [modal, setModal] = useState(false);
    const images = getImages();
    
    return (
        <div className="relative flex flex-col gap-3 lg:flex-1">
            <p className="text-sm font-medium">Nova imagem do grupo</p>

            {modal && (
                <>
                    <div
                        onClick={() => setModal(false)}
                        aria-hidden="true"
                        className="fixed inset-0 z-40"
                    />

                    <div className="absolute top-full left-0 z-50 mt-2 bg-glass rounded-2xl p-5 w-fit">
                        <div className="grid grid-cols-2 gap-3">
                            {images.map((img) => (
                                <button
                                    key={img}
                                    onClick={() => { setNewSelectedImage(img); setModal(false); }}
                                >
                                    <img
                                        key={img}
                                        src={img}
                                        alt="Imagem do grupo"
                                        className="w-20 h-20 rounded-xl object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <button
                type="button"
                onClick={() => setModal(!modal)}
                aria-label="Adicionar imagens"
                className="flex flex-col items-center justify-center gap-1 w-full aspect-3/2
        rounded-2xl shadow-lg text-neutral-700 bg-black/5 border-2 border-black
        px-5 py-4 font-huninn leading-tight"
            >
                {newSelectedImage && (
                    <img
                        src={newSelectedImage}
                        alt="Imagem do grupo"
                        className="rounded-2xl shadow-md"
                    />
                )}
            </button>
        </div>
    );
}