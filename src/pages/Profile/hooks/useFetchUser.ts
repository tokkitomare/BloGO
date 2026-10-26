import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import type { User } from "../../../types";

export function useFetchUser(id: string) {
    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await api.get("/users", {
                    params: { id },
                });

                setUserData(response.data[0]);
            } catch (error) {
                console.error("Erro ao buscar usuário:", error);
            }
        }

        fetchUser();
    }, [id]);

    return userData;
}