import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Group } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";

const glassButton = `border border-white/45 bg-black/45 text-white shadow-glow-5 cursor-pointer
    transition duration-150 motion-reduce:transition-none
    hover:bg-black/60 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
    disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-black/45`;

export default function GroupCreate() {
    const { user } = useAuth();
    const { id } = useParams();

    const navigate = useNavigate();

    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupDesc, setNewGroupDesc] = useState("");
    const [newSelectedImage, setNewSelectedImage] = useState("");

    const [oldGroup, setOldGroup] = useState<Group | null>(null);

    useEffect(() => {
        async function getOldGroup() {
            try {
                const res = await api.get("/groups", {
                    params: { id },
                });

                const group: Group = res.data[0];

                setOldGroup(group);

                setNewGroupName(group.name ?? "");
                setNewGroupDesc(group.description ?? "");
                setNewSelectedImage(group.photo ?? "");

                console.log(group);
            } catch (error) {
                console.error("Erro ao buscar grupo:", error);
            }
        }

        getOldGroup();
    }, []);

    const canEdit = newGroupName.length > 0 || newGroupDesc.length > 0 || newSelectedImage.length > 0;

    const [modal, setModal] = useState(false);

    async function handleSave() {
        if (!canEdit || !user || !oldGroup) return false;

        const editGroup: Group = {
            ...oldGroup,
            name: newGroupName,
            description: newGroupDesc,
            photo: newSelectedImage,
        };

        try {
            await api.patch(`/groups/${id}`, editGroup);
            return true;
        } catch (error) {
            console.error("Erro ao editar grupo:", error);
            return false;
        }
    }

    async function handleEdit() {
        const saved = await handleSave();

        if (saved && id) {
            navigate(`/group/about/${id}`);
        }
    }

    useEffect(() => {
        if (!canEdit) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Enter" || e.shiftKey || e.isComposing || e.target instanceof HTMLTextAreaElement) return;

            e.preventDefault();
            handleEdit();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [canEdit, handleEdit]);

    const images = Object.values(
        import.meta.glob("../../assets/images/*.jp*", {
            eager: true,
            query: "?url",
            import: "default",
        })
    ) as string[];

    return (
        <main className="flex justify-center items-center h-full w-full p-3 sm:p-5">
            <title>Gerenciar Grupo - BloGO</title>

            <div className="w-full max-w-4xl min-h-4/5 flex flex-col gap-6 bg-gradient-light text-black p-5 sm:p-8 rounded-tl-3xl rounded-br-3xl">
                <div className="flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-y-auto lg:overflow-visible">
                    <div className="flex items-baseline justify-between">
                        <label htmlFor="post-title" className="text-sm font-medium opacity-70">
                            Novo nome do grupo
                        </label>
                        <span className="text-xs text-black/60 tabular-nums">
                            {newGroupName.length}/{32}
                        </span>
                    </div>

                    <input
                        id="post-title"
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Deixe em branco para continuar com o atual"
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
                                Nova descrição
                            </label>
                            <span className="text-xs text-black/60 tabular-nums">
                                {newGroupDesc.length}/{256}
                            </span>
                        </div>
                        <textarea
                            id="topic-description"
                            name="description"
                            value={newGroupDesc}
                            onChange={(e) => setNewGroupDesc(e.target.value)}
                            maxLength={256}
                            placeholder="Deixe em branco para continuar com a atual"
                            className="w-full h-full bg-black/5 rounded-tl-2xl rounded-br-2xl border-t-2 border-black
                            px-5 py-4 font-huninn leading-tight resize-none
                            placeholder:text-black/40 selection:bg-black selection:text-white
                            focus:outline-none focus:bg-black/10 transition-colors motion-reduce:transition-none"
                        />
                    </div>

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
                </div>


                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm opacity-70">
                        {canEdit ? "Tudo pronto para alterar." : "Para alterar, altere o nome, altere a descrição ou edite a foto do seu grupo."}
                    </p>
                    <button
                        type="button"
                        onClick={handleEdit}
                        disabled={!canEdit}
                        className={`${glassButton} font-huninn text-lg px-10 py-3 rounded-tl-2xl rounded-br-2xl`}
                    >
                        Alterar grupo
                    </button>
                </div>
            </div>
        </main>
    );
}