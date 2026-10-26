import { useEffect } from "react";
import type { Post, User } from "../../../types";
import { api } from "../../../lib/api";

export function useRequest(
    posts: Post[],
    setAuthors: (authors: Record<string, User>) => void,
) {
    useEffect(() => {
        const owners = [...new Set(posts.map((post) => post.ownerId))];
        if (owners.length === 0) return;

        let cancelled = false;

        const query = owners
            .map((owner) => `${"id"}=${encodeURIComponent(owner)}`)
            .join("&");

        api.get<User[]>(`/users?${query}`)
            .then(({ data }) => {
                if (cancelled) return;

                const authorsMap = Object.fromEntries(
                    data.map((user) => [String(user.id), user])
                );

                setAuthors(authorsMap);
            })
            .catch((err) => {
                console.error("Erro ao buscar autores:", err);
            });

        return () => {
            cancelled = true;
        };
    }, [posts]);
}