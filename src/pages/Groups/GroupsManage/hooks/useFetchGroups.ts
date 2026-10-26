import { useEffect, useState } from "react";
import type { Group, User } from "../../../../types";
import { api } from "../../../../lib/api";

export function useFetchGroups(
    dbUser: User | null,
) {
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        async function fetchGroups() {
            try {
                const res = await api.get<Group[]>("/groups", {
                    params: {
                        ownerId: dbUser?.id,
                    },
                });
                setGroups(res.data);
            } catch (error) {
                console.error("Erro ao buscar grupos:", error);
            }
        }

        fetchGroups();
    }, [dbUser]);

    return groups;
}