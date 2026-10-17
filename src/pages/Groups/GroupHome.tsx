import { useMemo } from "react";
import { Link } from "react-router-dom";
import type { Post } from "../../types";

function loadPosts(): Post[] {
    try {
        const parsed = JSON.parse(localStorage.getItem("groupPosts") ?? "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

const fullDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

const relative = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

function formatDate(value: string | number | Date): string {
    const date = new Date(value);
    const diffSeconds = Math.round((date.getTime() - Date.now()) / 1000);
    const abs = Math.abs(diffSeconds);

    if (abs < 60) return "agora há pouco";
    if (abs < 3600) return relative.format(Math.round(diffSeconds / 60), "minute");
    if (abs < 86400) return relative.format(Math.round(diffSeconds / 3600), "hour");
    if (abs < 86400 * 7) return relative.format(Math.round(diffSeconds / 86400), "day");
    return fullDate.format(date);
}

export default function Home() {
    const posts = useMemo(
        () =>
            loadPosts().sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
        []
    );

    return (
        <main className="w-full lg:w-full h-full px-3 sm:px-5 py-2">
            <title>Homepage - BloGO</title>
            {posts.length === 0 ? (
                <div className="mt-10 p-8 rounded-2xl bg-glass shadow-glow-3 border border-white/30 text-center flex flex-col items-center gap-2">
                    <h2 className="text-xl font-bold">Nenhuma publicação ainda</h2>
                    <p className="text-sm opacity-70">
                        Quando alguém publicar, os posts aparecem aqui.
                    </p>
                </div>
            ) : (
                <ul className="flex flex-col gap-4">
                    {posts.map((post) => (
                        <li key={post.id}>
                            <Link
                                to={`/post/${post.id}`}
                                className="group block p-5 rounded-2xl
                                bg-white/35 backdrop-blur-md border border-white/30 shadow-glow-3
                                transition duration-200 hover:bg-white/50 hover:-translate-y-0.5
                                motion-reduce:transition-none motion-reduce:hover:translate-y-0
                                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                <article className="flex flex-col gap-3">
                                    <header className="flex items-center gap-3">
                                        <span
                                            aria-hidden="true"
                                            className="size-10 shrink-0 rounded-full bg-glass shadow-glow-2
                                            flex items-center justify-center font-bold text-white select-none"
                                        >
                                            {post.user.charAt(0).toUpperCase()}
                                        </span>
                                        <div className="min-w-0 leading-tight">
                                            <p className="font-semibold truncate">{post.user}</p>
                                            <time
                                                dateTime={new Date(post.date).toISOString()}
                                                title={fullDate.format(new Date(post.date))}
                                                className="text-sm opacity-65"
                                            >
                                                {formatDate(post.date)}
                                            </time>
                                        </div>
                                    </header>

                                    <h2 className="text-xl font-bold leading-snug text-balance">
                                        {post.title}
                                    </h2>
                                </article>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}