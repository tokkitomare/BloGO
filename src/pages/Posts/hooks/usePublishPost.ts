import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { createPost } from "../services/postService";
import { buildPost } from "../utils/buildPost";
import { getStoredTopics } from "../utils/topicStorage";
import type { User } from "../../../types";
import { api } from "../../../lib/api";

interface UsePublishPostParams {
    title: string;
    topicCount: number;
    onTopicsRefresh: () => void;
    onTopicsClear: () => void;
    groupId: string | null;
}

async function getUserByFirebaseUid(
    firebaseUid: string
): Promise<User | null> {
    const { data } = await api.get<User[]>("/users", {
        params: { firebaseUid },
    });

    return data[0] ?? null;
}

export function usePublishPost({
    title,
    topicCount,
    onTopicsRefresh,
    onTopicsClear,
    groupId,
}: UsePublishPostParams) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isPosting, setIsPosting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isReady = title.trim().length > 0 && topicCount > 0 && !isPosting;
    const canSubmit = isReady && Boolean(user?.uid);

    async function publish() {
        if (!canSubmit || !user?.uid) return;

        setIsPosting(true);
        setError(null);

        try {
            const topics = getStoredTopics();

            if (topics.length === 0) {
                onTopicsRefresh();
                return;
            }

            const dbUser = await getUserByFirebaseUid(user.uid);

            if (!dbUser) {
                setError("Não encontramos o seu usuário. Faça login novamente.");
                return;
            }

            const post = buildPost({
                ownerId: dbUser.id,
                title,
                topics,
                groupId
            });

            await createPost(post);

            onTopicsClear();
            navigate(`/post/${post.id}`);
        } catch (err) {
            console.error("Erro ao publicar post:", err);
            setError("Não foi possível publicar o post. Tente novamente.");
        } finally {
            setIsPosting(false);
        }
    }

    return { isReady, canSubmit, isPosting, error, publish };
}