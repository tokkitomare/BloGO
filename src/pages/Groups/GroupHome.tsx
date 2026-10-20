import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, ChevronDown, Pencil } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import type { Group, Post, User } from "../../types";
import { api } from "../../lib/api";

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

type SortOption = "relevancy" | "likes" | "views" | "newer" | "older";

const localized: Record<SortOption, string> = {
    relevancy: "Relevância",
    likes: "Curtidas",
    views: "Visualizações",
    newer: "Mais Recentes",
    older: "Mais Antigos",
};

const serverSort = {
    likes: { _sort: "likes", _order: "desc" },
    views: { _sort: "views", _order: "desc" },
    newer: { _sort: "date", _order: "desc" },
    older: { _sort: "date", _order: "asc" },
} as const;

// Campo do usuário no db.json que guarda o mesmo valor de post.owner.
// Se os seus usuários usam "uid" em vez de "id", troque aqui.
const USER_OWNER_FIELD = "id";

const ratio = (p: Post) => (p.views > 0 ? p.likes / p.views : 0);

export default function GroupHome() {
    const { id } = useParams();

    const [posts, setPosts] = useState<Post[]>([]);
    const [authors, setAuthors] = useState<Record<string, User>>({});
    const [sortBy, setSortBy] = useState<SortOption>("relevancy");

    useEffect(() => {
        let cancelled = false;

        async function fetchPosts() {
            const params = sortBy === "relevancy" ? {} : serverSort[sortBy];

            const { data: groups } = await api.get<Group[]>("/groups");
            const group = groups.find(g => g.id === id);

            if (!group) {
                setPosts([]);
                return;
            }

            const { data: posts } = await api.get<Post[]>("/posts", { params });

            if (!cancelled) {
                setPosts(
                    posts.filter(post => post.groupId === group.id)
                );
            }
        }

        fetchPosts();

        return () => {
            cancelled = true;
        };
    }, [sortBy, id]);

    // Autores: uma única requisição com todos os post.owner
    useEffect(() => {
        const owners = [...new Set(posts.map((post) => post.ownerId))];
        if (owners.length === 0) return;

        let cancelled = false;

        // Monta ?campo=a&campo=b, que o json-server entende como "a OU b".
        const query = owners
            .map((owner) => `${USER_OWNER_FIELD}=${encodeURIComponent(owner)}`)
            .join("&");

        api.get<User[]>(`/users?${query}`)
            .then(({ data }) => {
                if (cancelled) return;

                // Indexa por owner, que é a chave usada na lista: authors[post.owner]
                setAuthors(
                    Object.fromEntries(
                        data.map((user) => [
                            String(
                                (user as unknown as Record<string, unknown>)[
                                USER_OWNER_FIELD
                                ]
                            ),
                            user,
                        ])
                    )
                );
            })
            .catch(() => {
                // Sem autores a lista continua funcionando.
            });

        return () => {
            cancelled = true;
        };
    }, [posts]);

    const sortedPosts =
        sortBy === "relevancy" ? posts.toSorted((a, b) => ratio(b) - ratio(a)) : posts;

    return (
        <main className="w-full lg:w-full h-full px-3 sm:px-5 py-2">
            <title>Início - BloGO</title>

            <div className="flex justify-between">
                <div className="relative w-fit mb-2 focus:outline-none font-huninn">
                    <Select.Root
                        value={sortBy}
                        onValueChange={(value) => setSortBy(value as SortOption)}
                    >
                        <Select.Trigger
                            aria-label="Ordenar posts"
                            className="px-4 py-2 rounded-xl bg-glass shadow-glow-3
                    border border-white/30 text-white
                    flex items-center justify-center gap-2
                    cursor-pointer outline-none
                    focus-visible:ring-2 focus-visible:ring-white/30"
                        >
                            <Select.Value />
                            <Select.Icon>
                                <ChevronDown
                                    size={16}
                                    className="transition-transform"
                                />
                            </Select.Icon>
                        </Select.Trigger>

                        <Select.Portal>
                            <Select.Content
                                position="popper"
                                sideOffset={6}
                                align="start"
                                className="z-50 min-w-45 overflow-hidden
                        rounded-xl border border-white/10
                        bg-gradient-dark shadow-glow-2
                        text-white select-none"
                            >
                                <Select.Group>
                                    <Select.Label className="px-4 pt-3 pb-2
                        text-sm text-white/50 text-center">
                                        Ordenar por:
                                    </Select.Label>

                                    <Select.Viewport className="p-1">
                                        {Object.entries(localized).map(([key, value]) => (
                                            <Select.Item
                                                key={key}
                                                value={key}
                                                className="relative flex items-center
                                    justify-between gap-4 rounded-md
                                    px-4 py-2 text-sm text-white/80
                                    outline-none cursor-pointer
                                    data-highlighted:bg-white/10
                                    data-highlighted:text-white
                                    data-[state=checked]:text-white"
                                            >
                                                <Select.ItemText>
                                                    {value}
                                                </Select.ItemText>

                                                <Select.ItemIndicator>
                                                    <Check size={16} />
                                                </Select.ItemIndicator>
                                            </Select.Item>
                                        ))}
                                    </Select.Viewport>
                                </Select.Group>
                            </Select.Content>
                        </Select.Portal>
                    </Select.Root>
                </div>

                <Link
                    to={"/post"}
                    state={{ groupId: id }}
                    className="bg-gradient-light shadow-glow-3 rounded-full h-12 w-12 flex items-center justify-center"
                >
                    <Pencil
                        strokeWidth={1.5}
                        size={24}
                        className="transition-transform text-black"
                    />
                </Link>
            </div>



            {posts.length === 0 ? (
                <div className="mt-2 p-8 rounded-2xl bg-glass shadow-glow-3 border border-white/30 text-center flex flex-col items-center gap-2">
                    <h2 className="text-xl font-bold">Nenhuma publicação ainda</h2>
                    <p className="text-sm opacity-70">
                        Quando alguém publicar, os posts aparecem aqui.
                    </p>
                </div>
            ) : (
                <ul className="flex flex-col gap-4">
                    {sortedPosts.map((post) => (
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
                                            className="group relative size-10 rounded-full bg-glass shadow-glow-2 overflow-hidden
                            flex items-center justify-center text-white 
                            focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                                        >
                                            {authors[post.ownerId]?.photoUrl && (
                                                <img
                                                    key={authors[post.ownerId]?.photoUrl}
                                                    src={authors[post.ownerId]?.photoUrl}
                                                    alt="Foto de perfil"
                                                    referrerPolicy="no-referrer"
                                                    onLoad={() => console.log("Foto carregada:", authors[post.ownerId]?.photoUrl)}
                                                    onError={() => {
                                                        console.error("Falha ao carregar foto:", authors[post.ownerId]?.photoUrl);
                                                    }}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            )}
                                        </span>
                                        <div className="min-w-0 leading-tight">
                                            <p className="font-semibold truncate">{authors[post.ownerId]?.displayName ?? "Anônimo"}</p>
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