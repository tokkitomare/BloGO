import { useEffect, useState } from "react";
import type { User as DbUser } from "../../../../types";
import type { User } from "firebase/auth";


export function useSetMember(
    id: string | undefined, 
    user: User | null, 
    dbUser: DbUser | null
) {
    const [member, setMember] = useState(false);

    useEffect(() => {
        if (!user) {
            setMember(false);
            return;
        }
        setMember(!!dbUser?.groups.find(group => group === id));
    }, [dbUser, id, user]);

    return member;
}