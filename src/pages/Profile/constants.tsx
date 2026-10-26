import type { ReactNode } from "react";
import type { User } from "../../types";
import { Bookmark, MessageSquare, UserGroup } from "lucide-react";

export type TabId = "grupos" | "salvos" | "postagens";

export type Tab = {
    id: TabId;
    label: string;
    count: number;
    icon: ReactNode;
    empty: { title: string; text: string; action: string };
};

export const TABS: Tab[] = [
    {
        id: "grupos",
        label: "Grupos",
        count: 0,
        icon: <UserGroup strokeWidth={1.5} />,
        empty: {
            title: "Você ainda não participa de nenhum grupo",
            text: "Entre em um grupo para conversar e compartilhar com outras pessoas.",
            action: "Explorar grupos",
        },
    },
    {
        id: "salvos",
        label: "Salvos",
        count: 0,
        icon: <Bookmark strokeWidth={1.5} />,
        empty: {
            title: "Nada salvo por aqui",
            text: "Salve publicações para encontrá-las depois com um toque.",
            action: "Ver publicações",
        },
    },
    {
        id: "postagens",
        label: "Postagens",
        count: 0,
        icon: <MessageSquare strokeWidth={1.5} />,
        empty: {
            title: "Nenhuma postagem ainda",
            text: "Faça postagens e elas aparecerão aqui.",
            action: "Ver publicações",
        },
    }
];

export const defaultUser: User = {
    id: "",
    firebaseUid: "",
    displayName: "Usuário não existente",
    email: "emailquenãoexiste@fantasma.boo.com.br",
    groups: [],
    posts: [],
    savedPosts: [],
    photoUrl: "https://www.svgrepo.com/show/508069/ghost.svg",
}