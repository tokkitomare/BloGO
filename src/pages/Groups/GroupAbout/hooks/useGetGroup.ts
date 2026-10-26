import { useEffect, useState } from "react";
import type { Group } from "../../../../types";
import { api } from "../../../../lib/api";

export function useGetGroup(id: string | undefined) {
    const [group, setGroup] = useState<Group | null>(null);

    useEffect(() => {
        api.get("/groups", {
            params: { id },
        }).then(({ data }) => {
            setGroup(data[0] ?? null);
        }).catch((e) => {
            console.error(e);
        });
    }, [id]);

    return group;
}