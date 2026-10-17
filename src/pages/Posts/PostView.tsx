// agora é fazer as imagens aparecerem

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { Post, Topic, User } from "../../types";
import { api } from "../../lib/api";

async function getPostById(id: string): Promise<Post> {
    const { data } = await api.get<Post>(`/posts/${id}`);
    return data;
}

/* -------------------------------------------------------------------------- */
/*  Utilitários                                                               */
/* -------------------------------------------------------------------------- */

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
});

const TOPIC_DOM_PREFIX = "topic-";

const topicDomId = (topicId: string) => `${TOPIC_DOM_PREFIX}${topicId}`;
const topicIdFromDomId = (domId: string) => domId.replace(TOPIC_DOM_PREFIX, "");
const formatPostDate = (date: string | Date) => dateFormatter.format(new Date(date));

/* -------------------------------------------------------------------------- */
/*  Hooks                                                                     */
/* -------------------------------------------------------------------------- */

type PostStatus = "loading" | "success" | "not-found" | "error";

function useAuthor(ownerId?: string) {
    const [author, setAuthor] = useState<User | null>(null);

    useEffect(() => {
        if (!ownerId) return;

        let cancelled = false;

        api.get<User[]>("/users", { params: { id: ownerId } })
            .then(({ data }) => {
                if (!cancelled) setAuthor(data[0] ?? null);
            })
            .catch((error) => {
                console.error("Erro ao buscar usuário:", error);
            });

        return () => {
            cancelled = true;
        };
    }, [ownerId]);

    return author;
}

/** Busca um post no backend e informa em qual estado a requisição está. */
function usePost(id?: string) {
    const [post, setPost] = useState<Post | null>(null);
    const [status, setStatus] = useState<PostStatus>("loading");

    useEffect(() => {
        if (!id) {
            setStatus("not-found");
            return;
        }

        let cancelled = false;
        setStatus("loading");

        getPostById(id)
            .then((data) => {
                if (cancelled) return;
                setPost(data);
                setStatus("success");
            })
            .catch((err) => {
                if (cancelled) return;
                const isNotFound =
                    axios.isAxiosError(err) && err.response?.status === 404;
                setStatus(isNotFound ? "not-found" : "error");
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    return { post, status };
}

/** Descobre qual tópico está visível na tela, para destacar no sumário. */
function useActiveTopic(topics: Topic[]) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        if (topics.length === 0) return;

        setActiveId(topics[0].id);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible) setActiveId(topicIdFromDomId(visible.target.id));
            },
            { rootMargin: "-10% 0px -70% 0px" }
        );

        topics.forEach((topic) => {
            const element = document.getElementById(topicDomId(topic.id));
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [topics]);

    return activeId;
}

/* -------------------------------------------------------------------------- */
/*  Componentes                                                               */
/* -------------------------------------------------------------------------- */

interface PostHeaderProps {
    user: User,
    title: string;
    date: string | Date;
}

function PostHeader({ user, title, date }: PostHeaderProps) {
    return (
        <header className="mb-6 flex flex-col gap-4">
            <div className="grid grid-cols-[3fr_7fr] gap-3">
                <div className="flex items-center gap-3">
                    <Link
                        to={`/profile/${user.id}`}
                        aria-hidden="true"
                        className="group relative size-10 rounded-full bg-glass shadow-glow-2 overflow-hidden
                            flex items-center justify-center text-white 
                            focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                        {user.photoUrl && (
                                <img
                                    key={user.photoUrl}
                                    src={user.photoUrl}
                                    alt="Foto de perfil"
                                    referrerPolicy="no-referrer"
                                    onLoad={() => console.log("Foto carregada:", user.photoUrl)}
                                    onError={() => {
                                        console.error("Falha ao carregar foto:", user.photoUrl);
                                    }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            )}
                    </Link>

                    <p className="leading-tight">
                        <span className="font-semibold">{user.displayName}</span>
                        <br />
                        <time
                            dateTime={new Date(date).toISOString()}
                            className="text-sm opacity-70"
                        >
                            {formatPostDate(date)}
                        </time>
                    </p>
                </div>

                <h1 className="wrap-anywhere font-huninn font-extrabold text-3xl sm:text-4xl leading-tight text-balance text-shadow-[0_0_8px]">
                    {title}
                </h1>
            </div>
        </header>
    );
}

function PostContent({ topics }: { topics: Topic[] }) {
    return (
        <article className="bg-glass rounded-tl-3xl rounded-br-3xl p-5 sm:p-8 flex flex-col gap-12">
            {topics.length === 0 ? (
                <p className="opacity-70">Este post ainda não tem conteúdo.</p>
            ) : (
                topics.map((topic) => (
                    <section
                        key={topic.id}
                        id={topicDomId(topic.id)}
                        className="scroll-mt-6"
                    >
                        <h2 className="white-space font-huninn font-bold text-2xl sm:text-3xl mb-4 text-shadow-[0_0_8px]">
                            {topic.title}
                        </h2>
                        <p className="wrap-anywhere leading-relaxed max-w-[70ch] whitespace-pre-line">
                            {topic.description}
                        </p>
                    </section>
                ))
            )}
        </article>
    );
}

const linkBase = `wrap-anywhere block rounded-xl px-3 py-2 transition-colors duration-200 motion-reduce:transition-none
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`;
const linkActive = "bg-white/25 font-semibold";
const linkIdle = "text-white/75 hover:bg-white/10 hover:text-white";

interface TopicsNavProps {
    topics: Topic[];
    activeId: string | null;
}

function TopicsNav({ topics, activeId }: TopicsNavProps) {
    return (
        <nav
            aria-label="Sumário do post"
            className="lg:sticky lg:top-5 bg-glass text-white p-3 rounded-tl-3xl rounded-br-3xl shadow-glow-3"
        >
            <p className="px-3 pt-2 pb-3 font-huninn text-lg">Neste post</p>

            <ul className="flex flex-col gap-1">
                {topics.map((topic) => {
                    const isCurrent = topic.id === activeId;

                    return (
                        <li key={topic.id}>
                            <a
                                href={`#${topicDomId(topic.id)}`}
                                aria-current={isCurrent ? "true" : undefined}
                                className={`${linkBase} ${isCurrent ? linkActive : linkIdle}`}
                            >
                                {topic.title}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

/* -------------------------------------------------------------------------- */
/*  Página                                                                    */
/* -------------------------------------------------------------------------- */

export default function PostView() {
    const { id } = useParams<{ id: string }>();
    const { post, status } = usePost(id);
    const author = useAuthor(post?.owner);

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

            {author && (<PostHeader
                user={author}
                title={post.title}
                date={post.date}
            />)}

            <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6 items-start">
                <PostContent topics={topics} />
                {topics.length > 0 && (
                    <TopicsNav topics={topics} activeId={activeId} />
                )}
            </div>
        </main>
    );
}