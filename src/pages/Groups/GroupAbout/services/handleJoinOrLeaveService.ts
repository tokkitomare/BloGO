import type { User as DbUser } from "../../../../types";
import type { User } from "firebase/auth";
import { type NavigateFunction } from "react-router-dom";
import type { Group } from "../../../../types";
import { api } from "../../../../lib/api";

export async function handleJoinOrLeaveService(
    user: User | null,
    group: Group | null,
    dbUser: DbUser | null,
    member: boolean,
    id: string | undefined,
    navigate: NavigateFunction,
) {
        if (!user) {
            navigate("/login")
            return;
        };

        if (!group) return;

        const currentGroups = dbUser?.groups ?? [];
        const currentMembers = group.members ?? [];

        const updateUser = member
            ? currentGroups.filter((group) => group !== id)
            : [...currentGroups, id];

        await api.patch(`/users/${dbUser?.id}`, {
            groups: updateUser,
        });

        const updateGroup = member
            ? currentMembers.filter((member) => member !== dbUser?.id)
            : [...currentMembers, dbUser?.id];

        await api.patch(`/groups/${id}`, {
            members: updateGroup,
        });

        window.location.reload();
    }