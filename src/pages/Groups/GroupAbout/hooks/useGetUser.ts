import { useEffect, useState } from "react";
import { type User } from "../../../../types";
import { api } from "../../../../lib/api";

export function useGetUser(firebaseUid: string | undefined) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        api.get("/users", {
            params: {
                firebaseUid,
            },
        }).then(({ data }) => {
            setUser(data[0] ?? null);
        }).catch((e) => {
            console.error(e);
        });
    }, [user]);

    return user;
}