import { useEffect, useState } from "react";
import type { Group } from "../../../../types";
import { api } from "../../../../lib/api";

export function useFetchGroups() {
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        async function fetchGroups() {
            try {
                const res = await api.get<Group[]>("/groups");
                setGroups(res.data);
            } catch (error) {
                console.error("Erro ao buscar grupos:", error);
            }
        }

        fetchGroups();
    }, []);

    return groups;
}