import { useEffect, useState } from "react";
import { api } from "../../../../lib/api";
import type { Group } from "../../../../types";

export function useGetOldGroup(
    id: string | undefined,
    
    setNewGroupName: (v: string) => void,
    setNewGroupDesc: (v: string) => void,
    setNewSelectedImage: (v: string) => void,
) {
    const [oldGroup, setOldGroup] = useState<Group | null>(null);

    useEffect(() => {
        async function getOldGroup() {
            try {
                const res = await api.get("/groups", {
                    params: { id },
                });

                const group: Group = res.data[0];

                setOldGroup(group);

                setNewGroupName(group.name ?? "");
                setNewGroupDesc(group.description ?? "");
                setNewSelectedImage(group.photo ?? "");
            } catch (error) {
                console.error("Erro ao buscar grupo:", error);
            }
        }

        getOldGroup();
    }, []);

    return oldGroup;
}