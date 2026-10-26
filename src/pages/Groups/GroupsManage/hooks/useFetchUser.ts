import { useEffect, useState } from "react";
import type { User as DbUser } from "../../../../types";
import { api } from "../../../../lib/api";
import type { User } from "firebase/auth";

export function useFetchUser(
    user: User | null,
) {
    const [dbUser, setDbUser] = useState<DbUser | null>(null);

    useEffect(() => {
        api.get("/users", {
            params: {
                firebaseUid: user?.uid,
            },
        })
            .then(({data}) => setDbUser(data[0] ?? null))
            .catch((e) => console.error(e));
    }, [user]);

    return dbUser;
}