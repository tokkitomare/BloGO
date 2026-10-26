import type { User as FirebaseUser } from "firebase/auth";
import { useEffect, useState } from "react";
import type { User } from "../../../types";
import { api } from "../../../lib/api";

export function useGetUser(user: FirebaseUser | null) {
    const [dbUser, setDbUser] = useState<User | null>(null);

    useEffect(() => {
        if (!user) return;

        api.get("/users", {
            params: {
                firebaseUid: user.uid,
            },
        })
            .then(({ data }) => {
                setDbUser(data[0]);
            })
            .catch((err) => {
                console.error(err);
            })
    }, [user?.uid]);

    return dbUser;
}