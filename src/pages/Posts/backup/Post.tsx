
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateTopicModal from "./components/CreateTopicModal";
import ManageTopicsModal from "./components/ManageTopicsModal";
import type { Post, Topic } from "../../types";
import { useAuth } from "../../contexts/AuthContext";

function loadFromStorage<T>(key: string): T[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

const api = axios.create({
    baseURL: "http://localhost:3000",
});

const glassButton = `border border-white/45 bg-black/45 text-white shadow-glow-5 cursor-pointer
    transition duration-150 motion-reduce:transition-none
    hover:bg-black/60 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
    disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-black/45`;

export default function CreatePost() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [openCreateTopicModal, setOpenCreateTopicModal] = useState(false);
    const [openManageTopicsModal, setOpenManageTopicsModal] = useState(false);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

    const [postTitle, setPostTitle] = useState("");
    const [topicCount, setTopicCount] = useState(
        () => loadFromStorage<Topic>("topics").length
    );
    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canPost =
        postTitle.trim().length > 0 &&
        topicCount > 0 &&
        !isPosting;

    function refreshTopicCount() {
        setTopicCount(loadFromStorage<Topic>("topics").length);
    }

    async function handleSubmit() {
        if (!canPost || !user?.uid) return;

        setIsPosting(true);
        setError(null);

        try {
            const topics = loadFromStorage<Topic>("topics");

            if (topics.length === 0 || !postTitle.trim()) {
                refreshTopicCount();
                return;
            }

            const postId = crypto.randomUUID();

            const newPost: Post = {
                id: postId,
                owner: user.uid,
                title: postTitle.trim(),
                date: new Date(),
                topics: topics.map((topic) => ({
                    ...topic,
                    postId,
                })),
                likes: 0,
                views: 0,
                comments: [],
                groupId: null,
            };

            // Persiste o post no backend.
            await api.post("/posts", newPost);

            // Apaga os tópicos locais somente após sucesso.
            localStorage.removeItem("topics");
            setTopicCount(0);

            navigate(`/post/${postId}`);
        } catch (err) {
            console.error("Erro ao publicar post:", err);
            setError("Não foi possível publicar o post. Tente novamente.");
        } finally {
            setIsPosting(false);
        }
    }

    function handleEdit(topic: Topic) {
        setEditingTopic(topic);
        setOpenManageTopicsModal(false);
        setOpenCreateTopicModal(true);
    }

    function handleCreateClose() {
        const wasEditing = editingTopic !== null;

        setOpenCreateTopicModal(false);
        setEditingTopic(null);
        refreshTopicCount();

        if (wasEditing) setOpenManageTopicsModal(true);
    }

    function handleManageClose() {
        setOpenManageTopicsModal(false);
        refreshTopicCount();
    }

    return (
        <main className="flex justify-center items-center h-full w-full p-3 sm:p-5">
            <title>Postar - BloGO</title>

            <div className="w-full max-w-4xl min-h-4/5 flex flex-col gap-6 bg-gradient-light text-black p-5 sm:p-8 rounded-tl-3xl rounded-br-3xl">
                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="post-title"
                        className="text-sm font-medium opacity-70"
                    >
                        Título do post
                    </label>

                    <input
                        id="post-title"
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="Dê um título ao seu post (50 letras máx.)"
                        autoComplete="off"
                        maxLength={50}
                        className="w-full bg-black/5 rounded-tl-2xl rounded-br-2xl border-b-2 border-black px-5 py-4 font-huninn text-2xl sm:text-3xl leading-tight placeholder:text-black/40 selection:bg-black selection:text-white focus:outline-none focus:bg-black/10 transition-colors motion-reduce:transition-none"
                    />
                </div>

                <section
                    aria-labelledby="topics-heading"
                    className="flex-1 flex flex-col items-center justify-center gap-5 text-center p-6 sm:p-10 rounded-3xl bg-black/45 border border-white/45 shadow-glow-5 text-white"
                >
                    <div className="flex flex-col gap-1">
                        <h2 id="topics-heading" className="font-huninn text-2xl">
                            Tópicos
                        </h2>

                        <p className="text-sm text-white/75" aria-live="polite">
                            {topicCount === 0
                                ? "Nenhum tópico adicionado"
                                : topicCount === 1
                                  ? "1 tópico adicionado"
                                  : `${topicCount} tópicos adicionados`}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => {
                                setEditingTopic(null);
                                setOpenCreateTopicModal(true);
                            }}
                            className={`${glassButton} px-8 py-3 rounded-tl-2xl rounded-br-2xl`}
                        >
                            Adicionar tópico
                        </button>

                        <button
                            type="button"
                            onClick={() => setOpenManageTopicsModal(true)}
                            disabled={topicCount === 0}
                            className={`${glassButton} px-8 py-3 rounded-tl-2xl rounded-br-2xl`}
                        >
                            Gerenciar tópicos
                        </button>
                    </div>
                </section>

                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <p className="text-sm opacity-70">
                            {canPost
                                ? "Tudo pronto para publicar."
                                : "Para postar, informe um título e adicione ao menos um tópico."}
                        </p>

                        {error && (
                            <p role="alert" className="text-sm text-red-600 mt-2">
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canPost || !user?.uid}
                        className={`${glassButton} font-huninn text-lg px-10 py-3 rounded-tl-2xl rounded-br-2xl`}
                    >
                        {isPosting ? "Publicando..." : "Postar"}
                    </button>
                </div>
            </div>

            <CreateTopicModal
                isOpen={openCreateTopicModal}
                onClose={handleCreateClose}
                topic={editingTopic}
            />

            <ManageTopicsModal
                isOpen={openManageTopicsModal}
                onClose={handleManageClose}
                onEdit={handleEdit}
            />
        </main>
    );
}
