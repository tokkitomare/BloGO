import { useEffect, useState } from "react";
import type { User } from "../../../../types";
import { api } from "../../../../lib/api";

export function useAuthor(ownerId?: string) {
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