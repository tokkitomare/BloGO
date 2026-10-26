import type { User } from "firebase/auth";
import type { Group } from "../../../../types";
import { api } from "../../../../lib/api";

export async function handleSave(
    id: string | undefined,

    canEdit: boolean,
    user: User | null,
    oldGroup: Group | null,

    newGroupName: string,
    newGroupDesc: string,
    newSelectedImage: string,
) {
    if (!canEdit || !user || !oldGroup) return false;

    const editGroup: Group = {
        ...oldGroup,
        name: newGroupName,
        description: newGroupDesc,
        photo: newSelectedImage,
    };

    try {
        await api.patch(`/groups/${id}`, editGroup);
        return true;
    } catch (error) {
        console.error("Erro ao editar grupo:", error);
        return false;
    }
}