import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Group, User } from "../../types";
import { api } from "../../lib/api";
import { ChartSpline, Pin, ScrollText } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

type TabId = "mural" | "regras" | "estatisticas";

type Tab = {
    id: TabId;
    label: string;
    icon: ReactNode;
    empty: { title: string; text: string; };
};

const TABS: Tab[] = [
    {
        id: "mural",
        label: "Mural",
        icon: (
            <Pin strokeWidth={1.5} />
        ),
        empty: {
            title: "Nada fixado por aqui",
            text: "Mensagens, avisos e posts fixados para facilitar as coisas.",
        },
    },
    {
        id: "regras",
        label: "Regras",
        icon: (
            <ScrollText strokeWidth={1.5} />
        ),
        empty: {
            title: "O grupo ainda não tem regras",
            text: "Regras servem para manter as pessoas em conduta.",
        },
    },
    {
        id: "estatisticas",
        label: "Estatísticas",
        icon: (
            <ChartSpline strokeWidth={1.5} />
        ),
        empty: {
            title: "Sem informações",
            text: "Algumas informações e dados públicos sobre o grupo.",
        },
    },
];

// Aceita tanto string quanto array e devolve sempre uma lista
function toItems(content: unknown): string[] {
    if (Array.isArray(content)) return content as string[];
    if (content) return [String(content)];
    return [];
}

export default function GroupAbout() {
    const { user } = useAuth();

    const { id } = useParams();
    const navigate = useNavigate();

    const [active, setActive] = useState<TabId>("mural");
    const [member, setMember] = useState(false);
    const [groupInfo, setGroupInfo] = useState<Group | null>(null);

    const [dbUser, setDbUser] = useState<User | null>(null);

    useEffect(() => {
        api.get("/groups", {
            params: { id },
        }).then(({ data }) => {
            setGroupInfo(data[0] ?? null);
        }).catch((e) => {
            console.error(e);
        });
    }, [id]);

    useEffect(() => {
        api.get("/users", {
            params: {
                firebaseUid: user?.uid,
            },
        }).then(({ data }) => {
            setDbUser(data[0] ?? null);
        }).catch((e) => {
            console.error(e);
        });
    }, [user]);

    useEffect(() => {
        if (!user) {
            setMember(false);
            return;
        }
        setMember(!!dbUser?.groups.find(group => group === id));
    }, [dbUser, id, user]);

    if (!groupInfo) return null;

    const current = TABS.find((t) => t.id === active)!;

    const itemsByTab: Record<TabId, string[]> = {
        mural: toItems(groupInfo.mural),
        regras: toItems(groupInfo.rules),
        estatisticas: toItems(groupInfo.statistics),
    };

    const items = itemsByTab[current.id];
    const memberCount = groupInfo.members?.length ?? 0;

    async function handleJoinOrLeave() {
        if (!user) {
            navigate("/login")
            return;
        };

        if (!groupInfo) return;

        const currentGroups = dbUser?.groups ?? [];
        const currentMembers = groupInfo.members ?? [];

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

    return (
        <main className="w-full min-h-full p-3 sm:p-5 flex">
            <title>{`${groupInfo.name} - BloGO`}</title>
            <div className="w-full bg-gradient-light rounded-tl-4xl rounded-br-4xl p-3 sm:p-6 flex flex-col gap-4 sm:gap-5">

                {/* Cabeçalho: banner + avatar sobreposto + nome + ações */}
                <header className="bg-gradient-dark rounded-3xl overflow-hidden text-white">
                    <div className="h-24 sm:h-36 bg-glass" />

                    <div className="px-4 sm:px-8 pb-5 flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5">
                        <div
                            className="-mt-10 sm:-mt-14 shrink-0 size-20 sm:size-28 rounded-full bg-glass shadow-glow-2 overflow-hidden
                            ring-4 ring-white/20"
                        >
                            <img
                                src={groupInfo.photo}
                                alt={`Foto do grupo ${groupInfo.name}`}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <h1 className="font-huninn text-2xl sm:text-3xl truncate">
                                <Link to={`/group/${id}`}>{groupInfo.name}</Link>
                            </h1>
                            <p className="text-sm text-white/65">
                                {memberCount} {memberCount === 1 ? "membro" : "membros"}
                            </p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <button
                                type="button"
                                className="rounded-full px-5 py-2 text-sm font-medium bg-glass shadow-glow-2 cursor-pointer
                                hover:bg-white/10 transition-colors duration-200 motion-reduce:transition-none
                                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                onClick={() => navigate(`/group/${groupInfo.id}`)}
                            >
                                Ver grupo
                            </button>
                            {(!user || groupInfo.ownerId !== dbUser?.id) && (
                                <button
                                    type="button"
                                    aria-pressed={member}
                                    className={`rounded-full px-5 py-2 text-sm font-medium cursor-pointer
        transition-colors duration-200 motion-reduce:transition-none
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
        ${member ? "ring-1 ring-white/50 hover:bg-white/10" : "bg-glass shadow-glow-2 hover:bg-white/10"}`}
                                    onClick={handleJoinOrLeave}
                                >
                                    {member ? "Sair do grupo" : "Entrar"}
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Corpo: feed à esquerda, barra lateral à direita */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-4 sm:gap-5 items-start">

                    <div className="flex flex-col gap-4 sm:gap-5 min-w-0">

                        {/* Abas */}
                        <div
                            role="tablist"
                            aria-label="Informações do grupo"
                            className="bg-gradient-dark rounded-3xl px-3 flex gap-1 overflow-x-auto"
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
                                        className={`flex items-center gap-2 px-4 py-3 text-white cursor-pointer border-b-2 whitespace-nowrap
                                        transition-colors duration-200 motion-reduce:transition-none
                                        focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white
                                        ${selected ? "border-white" : "border-transparent text-white/70 hover:text-white hover:bg-white/10"}`}
                                    >
                                        {tab.icon}
                                        <span className="font-medium">{tab.label}</span>
                                        <span
                                            className={`min-w-6 rounded-full px-2 text-xs leading-6 tabular-nums
                                            ${selected ? "bg-white/25" : "bg-white/10"}`}
                                        >
                                            {itemsByTab[tab.id].length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Conteúdo da aba */}
                        <section
                            role="tabpanel"
                            id={`panel-${current.id}`}
                            aria-labelledby={`tab-${current.id}`}
                            className="min-h-64 flex flex-col gap-3 text-white"
                        >
                            {items.length === 0 ? (
                                <div className="flex-1 min-h-64 bg-gradient-dark rounded-3xl p-6 flex flex-col items-center justify-center gap-4 text-center">
                                    <div className="size-16 rounded-full bg-glass shadow-glow-2 flex items-center justify-center">
                                        {current.icon}
                                    </div>
                                    <h2 className="font-huninn text-xl">{current.empty.title}</h2>
                                    <p className="text-sm text-white/70">{current.empty.text}</p>
                                </div>
                            ) : current.id === "regras" ? (
                                <ol className="bg-gradient-dark rounded-3xl divide-y divide-white/10 overflow-hidden">
                                    {items.map((item, i) => (
                                        <li key={i} className="flex gap-4 px-5 py-4">
                                            <span className="font-huninn text-white/65 tabular-nums">{i + 1}.</span>
                                            <p className="min-w-0 wrap-break-word">{item}</p>
                                        </li>
                                    ))}
                                </ol>
                            ) : (
                                <ul className="flex flex-col gap-3">
                                    {items.map((item, i) => (
                                        <li
                                            key={i}
                                            className="bg-gradient-dark rounded-3xl p-4 sm:p-5 flex gap-4"
                                        >
                                            <div className="size-10 shrink-0 rounded-full bg-glass shadow-glow-2 flex items-center justify-center">
                                                {current.icon}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                {current.id === "mural" && (
                                                    <p className="text-xs text-white/65 mb-1">Fixado</p>
                                                )}
                                                <p className="wrap-break-word">{item}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>

                    {/* Barra lateral */}
                    <aside className="flex flex-col gap-4 sm:gap-5 lg:sticky lg:top-5 text-white">
                        <section className="bg-gradient-dark rounded-3xl overflow-hidden">
                            <h2 className="font-huninn text-lg px-5 py-3 bg-glass">Sobre o grupo</h2>
                            <div className="p-5 flex flex-col gap-4">
                                <p className="whitespace-pre-line wrap-break-word">
                                    {groupInfo.description || "Este grupo ainda não tem descrição."}
                                </p>

                                <dl className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                                    <div>
                                        <dd className="font-huninn text-2xl tabular-nums">{memberCount}</dd>
                                        <dt className="text-sm text-white/65">{memberCount === 1 ? "membro" : "membros"}</dt>
                                    </div>
                                    <div>
                                        <dd className="font-huninn text-2xl tabular-nums">{itemsByTab.regras.length}</dd>
                                        <dt className="text-sm text-white/65">{itemsByTab.regras.length === 1 ? "regra" : "regras"}</dt>
                                    </div>
                                </dl>

                                {groupInfo.ownerId !== dbUser?.id &&
                                    <button
                                        type="button"
                                        aria-pressed={member}
                                        className={`w-full rounded-full px-5 py-2 font-medium cursor-pointer
                                        transition-colors duration-200 motion-reduce:transition-none
                                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                                        ${member ? "ring-1 ring-white/50 hover:bg-white/10" : "bg-glass shadow-glow-2 hover:bg-white/10"}`}
                                        onClick={handleJoinOrLeave}
                                    >
                                        {member ? "Sair do grupo" : "Entrar no grupo"}
                                    </button>
                                }
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}