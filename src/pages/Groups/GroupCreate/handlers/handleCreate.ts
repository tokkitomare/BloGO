import type { User } from "firebase/auth";
import type { Group, User as DbUser } from "../../../../types";
import { api } from "../../../../lib/api";

async function getUserByFirebaseUid(
    firebaseUid: string
): Promise<DbUser | null> {
    const { data } = await api.get<DbUser[]>("/users", {
        params: { firebaseUid },
    });

    return data[0] ?? null;
}

export async function handleCreate(
    canCreate: boolean,
    user: User | null,
    groupName: string,
    groupDesc: string,
    selectedImage: string,
) {
    if (!canCreate || !user) return;

    const dbUser = await getUserByFirebaseUid(user?.uid);

    if (!dbUser) {
        alert("Não encontramos o seu usuário. Faça login novamente.");
        return;
    }

    const newGroup: Group = {
        id: crypto.randomUUID(),
        ownerId: dbUser.id,
        name: groupName,
        description: groupDesc,
        members: [dbUser.id],
        mural: [],
        rules: [],
        statistics: [],
        photo: selectedImage,
        posts: [],
    };

    await api.post("/groups", newGroup);

    return newGroup.id;
}