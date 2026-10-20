import { api } from "../lib/api";
import type { User } from "../types";

export async function getUserByFirebaseUid(
    firebaseUid: string
): Promise<User | null> {
    const { data } = await api.get<User[]>("/users", {
        params: { firebaseUid },
    });

    return data[0] ?? null;
}