import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Group } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { getUserByFirebaseUid } from "../../hooks/getUserByFirebaseUid";
import { api } from "../../lib/api";

const glassButton = `border border-white/45 bg-black/45 text-white shadow-glow-5 cursor-pointer
    transition duration-150 motion-reduce:transition-none
    hover:bg-black/60 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
    disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-black/45`;

export default function GroupCreate() {
    const { user } = useAuth();

    const navigate = useNavigate();

    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const canCreate = groupName.trim().length > 0 && groupDesc.trim().length > 0 && selectedImage;

    const [modal, setModal] = useState(false);

    async function handleSave() {
        if (!canCreate || !user) return;

        const dbUser = await getUserByFirebaseUid(user.uid);

        if (!dbUser) {
            alert("Não encontramos o seu usuário. Faça login novamente.");
            return;
        }

        const newGroup: Group = {
            id: crypto.randomUUID(),
            ownerId: dbUser.id,
            name: groupName,
            description: groupDesc,
            members: [dbUser.id],
            mural: [],
            rules: [],
            statistics: [],
            photo: selectedImage,
            posts: [],
        };
        await api.post("/groups", newGroup);

        return newGroup.id;
    }

    async function handleSubmit() {
        const id = handleSave();
        if (id) navigate(`/group/about/${await id}`);
    }

    useEffect(() => {
        if (!canCreate) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Enter" || e.shiftKey || e.isComposing || e.target instanceof HTMLTextAreaElement) return;

            e.preventDefault();
            handleSubmit();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [canCreate, handleSubmit]);

    const images = Object.values(
        import.meta.glob("../../assets/images/*.jp*", {
            eager: true,
            query: "?url",
            import: "default",
        })
    ) as string[];

    return (
        <main className="flex justify-center items-center h-full w-full p-3 sm:p-5">
            <title>Criar Grupo - BloGO</title>
            <div className="w-full max-w-4xl min-h-4/5 flex flex-col gap-6 bg-gradient-light text-black p-5 sm:p-8 rounded-tl-3xl rounded-br-3xl">
                <div className="flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-y-auto lg:overflow-visible">
                    <div className="flex items-baseline justify-between">
                        <label htmlFor="post-title" className="text-sm font-medium opacity-70">
                            Nome do grupo
                        </label>
                        <span className="text-xs text-black/60 tabular-nums">
                            {groupName.length}/{32}
                        </span>
                    </div>

                    <input
                        id="post-title"
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Dê um nome ao seu grupo (32 letras máx.)"
                        autoComplete="off"
                        className="w-full bg-black/5 rounded-tl-2xl rounded-br-2xl border-b-2 border-black
                        px-5 py-4 font-huninn text-2xl sm:text-3xl leading-tight
                        placeholder:text-black/40 selection:bg-black selection:text-white
                        focus:outline-none focus:bg-black/10 transition-colors motion-reduce:transition-none"
                        maxLength={32}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-y-auto lg:overflow-visible">
                    <div className="flex flex-col gap-2 lg:w-7/10 min-h-56 lg:min-h-0">
                        <div className="flex items-baseline justify-between">
                            <label htmlFor="topic-description" className="text-sm font-medium">
                                Descrição
                            </label>
                            <span className="text-xs text-black/60 tabular-nums">
                                {groupDesc.length}/{256}
                            </span>
                        </div>
                        <textarea
                            id="topic-description"
                            name="description"
                            value={groupDesc}
                            onChange={(e) => setGroupDesc(e.target.value)}
                            maxLength={256}
                            placeholder="Descreva seu grupo"
                            className="w-full h-full bg-black/5 rounded-tl-2xl rounded-br-2xl border-t-2 border-black
                            px-5 py-4 font-huninn leading-tight resize-none
                            placeholder:text-black/40 selection:bg-black selection:text-white
                            focus:outline-none focus:bg-black/10 transition-colors motion-reduce:transition-none"
                        />
                    </div>

                    <div className="relative flex flex-col gap-3 lg:flex-1">
                        <p className="text-sm font-medium">Imagem do grupo</p>

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
                                                onClick={() => { setSelectedImage(img); setModal(false); } }
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
                            {selectedImage ? (
                                <img src={selectedImage} className="rounded-2xl shadow-md" />
                            ) : (
                                <span className="text-4xl font-light leading-none">
                                    {modal ? "−" : "+"}
                                </span>
                            )}
                        </button>
                    </div>
                </div>


                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm opacity-70">
                        {canCreate ? "Tudo pronto para criar." : "Para criar, informe um nome, adicione uma descrição e selecione a foto do seu grupo."}
                    </p>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canCreate}
                        className={`${glassButton} font-huninn text-lg px-10 py-3 rounded-tl-2xl rounded-br-2xl`}
                    >
                        Criar grupo
                    </button>
                </div>
            </div>
        </main>
    );
}