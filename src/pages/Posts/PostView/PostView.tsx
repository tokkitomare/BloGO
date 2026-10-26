import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { usePost } from "./hooks/usePost";
import { useAuthor } from "./hooks/useAuthor";
import { useActiveTopic } from "./hooks/useActiveTopic";
import PostHeader from "./components/PostHeader";
import PostContent from "./components/PostContent";
import TopicsNav from "./components/TopicsNav";

export default function PostView() {
    const { id } = useParams<{ id: string }>();
    const { post, status } = usePost(id);
    const author = useAuthor(post?.ownerId);

    const topics = useMemo(() => post?.topics ?? [], [post]);
    const activeId = useActiveTopic(topics);

    if (status === "loading") {
        return <p className="p-5">Carregando...</p>;
    }

    if (status === "not-found") {
        return <Navigate to="/fallback" replace />;
    }

    if (status === "error" || !post) {
        return (
            <p role="alert" className="p-5">
                Não foi possível carregar o post.
            </p>
        );
    }

    return (
        <main className="w-full px-3 sm:px-5 pb-10">
            <title>{`${post.title} - BloGO`}</title>

            {author && (
                <PostHeader
                    user={author}
                    title={post.title}
                    date={post.date}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6 items-start">
                <PostContent topics={topics} />
                {topics.length > 0 && (
                    <TopicsNav topics={topics} activeId={activeId} />
                )}
            </div>
        </main>
    );
}