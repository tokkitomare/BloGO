import { useEffect, useState } from "react";
import type { Post, User } from "../../../../types";
import { api } from "../../../../lib/api";

export function useRequest(
    posts: Post[]
) {
    const [authors, setAuthors] = useState<Record<string, User>>({});

    useEffect(() => {
        const owners = [...new Set(posts.map((post) => post.ownerId))];
        if (owners.length === 0) return;

        let cancelled = false;
        
        const query = owners
            .map((owner) => `id=${encodeURIComponent(owner)}`)
            .join("&");

        api.get<User[]>(`/users?${query}`)
            .then(({ data }) => {
                if (cancelled) return;

                setAuthors(
                    Object.fromEntries(
                        data.map((user) => [
                            String(
                                (user as unknown as Record<string, unknown>)[
                                "id"
                                ]
                            ),
                            user,
                        ])
                    )
                );
            })
            .catch((err) => {
                console.error("Erro ao buscar autores:", err);
            });

        return () => {
            cancelled = true;
        };
    }, [posts]);

    return authors;
}