import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { Bookmark, MessageSquare, UserGroup } from "lucide-react";
import { api } from "../lib/api";
import type { User } from "../types";

type TabId = "grupos" | "salvos" | "postagens";

type Tab = {
    id: TabId;
    label: string;
    count: number;
    icon: ReactNode;
    empty: { title: string; text: string; action: string };
};

const TABS: Tab[] = [
    {
        id: "grupos",
        label: "Grupos",
        count: 0,
        icon: (
            <UserGroup strokeWidth={1.5} />
        ),
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
        icon: (
            <Bookmark strokeWidth={1.5} />
        ),
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
        icon: (
            <MessageSquare strokeWidth={1.5} />
        ),
        empty: {
            title: "Nenhuma postagem ainda",
            text: "Faça postagens e elas aparecerão aqui.",
            action: "Ver publicações",
        },
    }
];

const defaultUser: User = {
    id: "",
    firebaseUid: "",
    displayName: "Usuário não existente",
    email: "emailquenãoexiste@fantasma.boo.com.br",
    groups: [],
    posts: [],
    savedPosts: [],
    photoUrl: "https://www.svgrepo.com/show/508069/ghost.svg",
}

export default function UserProfile() {
    const { id } = useParams<{id: string}>();

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

    const user = userData ?? defaultUser;

    const [active, setActive] = useState<TabId>("grupos");
    const current = TABS.find((t) => t.id === active)!;

    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [user.photoUrl]);

    console.log(user.photoUrl)

    const { loading } = useAuth();

    if (loading) return (
        <main className="main-class"><p>Carregando...</p></main>
    );

    if (!user) return (
        <main className="main-class"><p>Você não está logado</p></main>
    );

    return (
        <main className="w-full min-h-full p-3 sm:p-5 flex">
            <title>Perfil - BloGO</title>
            <div className="w-full bg-gradient-light rounded-tl-4xl rounded-br-4xl p-3 sm:p-6 flex flex-col gap-4 sm:gap-5">

                <header className="relative bg-gradient-dark rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <div
                            className="group relative size-32 sm:size-44 rounded-full bg-glass shadow-glow-2 overflow-hidden
                            flex items-center justify-center text-white
                            ring-4 ring-white/20 ring-offset-4 ring-offset-transparent
                            focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                        >
                            
                            {user.photoUrl && !imageError && (
                                <img
                                    key={user.photoUrl}
                                    src={user.photoUrl}
                                    alt="Foto de perfil"
                                    referrerPolicy="no-referrer"
                                    onLoad={() => console.log("Foto carregada:", user.photoUrl)}
                                    onError={() => {
                                        console.error("Falha ao carregar foto:", user.photoUrl);
                                        setImageError(true);
                                    }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </div>

                    <dl className="w-full min-w-0 flex flex-col gap-4 sm:gap-6 text-white">
                        <div className="bg-glass shadow-glow-2 rounded-tl-2xl rounded-br-2xl px-5 py-3 min-w-0">
                            <dt className="text-sm text-white/65">Nome</dt>
                            <dd className="font-huninn text-2xl sm:text-4xl truncate">{user.displayName}</dd>
                        </div>
                        <div className="bg-glass shadow-glow-2 rounded-tl-2xl rounded-br-2xl px-5 py-3 min-w-0">
                            <dt className="text-sm text-white/65">E-mail</dt>
                            <dd className="font-huninn text-lg sm:text-3xl truncate">{user.email}</dd>
                        </div>
                    </dl>
                </header>

               
                <div
                    role="tablist"
                    aria-label="Atividade do perfil"
                    className="bg-gradient-dark rounded-3xl p-2 grid grid-cols-3 lg:grid-cols-3 gap-2"
                >
                    {TABS.map((tab) => {
                        const selected = tab.id === active;
                        return (
                            <button
                                key={tab.id}
                                role="tab"
                                id={`tab-${tab.id}`}
                                aria-selected={selected}
                                aria-controls={`panel-${tab.id}`}
                                type="button"
                                onClick={() => setActive(tab.id)}
                                className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-white cursor-pointer
                                transition-colors duration-200 motion-reduce:transition-none
                                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                                ${selected ? "bg-glass shadow-glow-2" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                            >
                                {tab.icon}
                                <span className="font-medium">{tab.label}</span>
                                <span
                                    className={`min-w-6 rounded-full px-2 text-xs leading-6 tabular-nums
                                    ${selected ? "bg-white/25" : "bg-white/10"}`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

              
                <section
                    role="tabpanel"
                    id={`panel-${current.id}`}
                    aria-labelledby={`tab-${current.id}`}
                    className="flex-1 min-h-64 bg-gradient-dark rounded-3xl p-6 flex items-center justify-center"
                >
                    <div className="max-w-sm flex flex-col items-center gap-4 text-center text-white">
                        <div className="size-16 rounded-full bg-glass shadow-glow-2 flex items-center justify-center">
                            {current.icon}
                        </div>
                        <h2 className="font-huninn text-xl">{current.empty.title}</h2>
                        <p className="text-sm text-white/70">{current.empty.text}</p>
                        <button
                            type="button"
                            className="rounded-full bg-glass shadow-glow-2 px-6 py-2.5 text-sm font-medium cursor-pointer
                            transition-transform duration-200 hover:scale-105 motion-reduce:transition-none
                            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            {current.empty.action}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}