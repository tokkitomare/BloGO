import { useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Group } from "../../types";

function loadFromStorage<T>(key: string): T[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

type TabId = "membros" | "mural" | "regras" | "estatisticas";

type Tab = {
    id: TabId;
    label: string;
    count: number;
    icon: ReactNode;
    empty: { title: string; text: string; };
};

const iconProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
};

const TABS: Tab[] = [
    {
        id: "membros",
        label: "Membros",
        count: 0,
        icon: (
            <svg {...iconProps}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        empty: {
            title: "Que solidão...",
            text: "Este grupo ainda não tem nenhum membro.",
        },
    },
    {
        id: "mural",
        label: "Mural",
        count: 0,
        icon: (
            <svg {...iconProps}>
                <line
                    x1="9.84396"
                    y1="14.15604"
                    x2="4.0131"
                    y2="19.9869"
                />
                <path
                    d="M14.68056,12.79836l5.21844-5.21844c0.11718-0.11718,0.11718-0.30708,0-0.42426l-3.05472-3.05472c-0.11718-0.11718-0.30708-0.11718-0.42426,0l-5.21844,5.21844-4.22508,0.61302c-0.4887,0.07092-0.6873,0.66888-0.3381,1.01802l6.41106,6.41106c0.3492,0.3492,0.94716,0.1506,1.01802-0.3381l0.61302-4.22508Z"
                />
            </svg>
        ),
        empty: {
            title: "Nada fixado por aqui",
            text: "Mensagens, avisos e posts fixados para facilitar as coisas.",
        },
    },
    {
        id: "regras",
        label: "Regras",
        count: 0,
        icon: (
            <svg {...iconProps} strokeWidth={1}>
                <path d="M15.56082,21.10452H3.36c-0.19884,0-0.36-0.16116-0.36-0.36V4.44012c0-0.19884,0.16116-0.36,0.36-0.36h1.26924"/>
                <path d="M17.7252,6.2088v7.9962c-0.1344-0.015-0.2706-0.0228-0.4086-0.0228-2.0346,0-3.6834,1.6494-3.6834,3.6834,0,0.5772,0.1326,1.1238,0.3696,1.6098H4.629V2.811c0-0.1992,0.1614-0.36,0.36-0.36h8.9778l3.7584,3.7578Z"/>
                <g>
                    <path d="M17.7252,6.2088v7.9962c-0.1344-0.015-0.2706-0.0228-0.4086-0.0228-2.0346,0-3.6834,1.6494-3.6834,3.6834,0,0.5772,0.1326,1.1238,0.3696,1.6098H4.989c-0.1986,0-0.36-0.1614-0.36-0.36V2.811c0-0.1992,0.1614-0.36,0.36-0.36h8.9778l3.7584,3.7578Z"/>
                    <path d="M17.7249,6.2088h-3.39792c-0.19884,0-0.36-0.16116-0.36-0.36V2.45088"/>
                </g>
                <line x1="6.76314" y1="8.42088" x2="15.591" y2="8.42088"/>
                <line x1="6.76314" y1="10.22088" x2="15.591" y2="10.22088"/>
                <line x1="6.76314" y1="12.02088" x2="15.591" y2="12.02088"/>
                <line x1="6.76314" y1="13.82088" x2="15.591" y2="13.82088"/>
                <line x1="6.76314" y1="15.62088" x2="11.4339" y2="15.62088"/>
                <line x1="6.76314" y1="6.62088" x2="8.4339" y2="6.62088"/>
                <circle cx="17.31654" cy="17.86566" r="3.68346"/>
                <polyline points="19.11834 16.59456 16.2609 19.452 15.1548 18.3459"/>
            </svg>
        ),
        empty: {
            title: "O grupo ainda não tem regras",
            text: "Regras servem para manter as pessoas em conduta.",
        },
    },
    {
        id: "estatisticas",
        label: "Estatísticas",
        count: 0,
        icon: (
            <svg {...iconProps}>
                <polyline points="21 19.86216 3 19.86216 3 4.13784"/>
                <polyline points="5.16978 16.4571 10.77972 9.73866 14.84238 12.75852 19.62714 7.19808"/>
            </svg>
        ),
        empty: {
            title: "Sem informações",
            text: "Algumas informações e dados públicos sobre o grupo.",
        },
    },
];

export default function GroupAbout() {
    const navigate = useNavigate();

    const [active, setActive] = useState<TabId>("membros");
    const current = TABS.find((t) => t.id === active)!;
    

    const [member, setMember] = useState(false);

    const { id } = useParams();

    const groupInfo = useMemo(() => loadFromStorage<Group>("groups").find((g) => String(g.id) === id), [id]);

    const groupInfoTabs = {
        membros: groupInfo?.members,
        mural: groupInfo?.mural,
        regras: groupInfo?.rules,
        estatisticas: groupInfo?.statistics,
    }

    const tabContent = groupInfoTabs[current.id];

    return (
        <main className="w-full min-h-full p-3 sm:p-5 flex">
            <title>{`${groupInfo?.name} - BloGO`}</title>
            <div className="w-full bg-gradient-light rounded-tl-4xl rounded-br-4xl p-3 sm:p-6 flex flex-col gap-4 sm:gap-5">

                <header className="relative bg-gradient-dark rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                   
                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <button
                            type="button"
                            aria-label="Alterar foto de perfil"
                            className="group relative size-32 sm:size-44 rounded-xl bg-glass shadow-glow-2 overflow-hidden
                            flex items-center justify-center text-white
                            ring-4 ring-white/20 ring-offset-4 ring-offset-transparent
                            focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                        > </button>
                    </div>

                    <dl className="w-full min-w-0 flex flex-col gap-4 sm:gap-6 text-white">
                        <div className="bg-glass shadow-glow-2 rounded-tl-2xl rounded-br-2xl px-5 py-3 min-w-0">
                            <dt className="text-sm text-white/65">Nome</dt>
                            <dd className="font-huninn text-2xl sm:text-4xl truncate">
                                <Link to={`/group/${id}`}>
                                    {groupInfo?.name}
                                </Link>
                            </dd>
                        </div>
                        <div className="bg-glass shadow-glow-2 rounded-tl-2xl rounded-br-2xl px-5 py-3 min-w-0">
                            <dt className="text-sm text-white/65">Descrição</dt>
                            <dd className="font-huninn text-lg">
                                {groupInfo?.description}
                            </dd>
                        </div>
                    </dl>
                </header>

                <div className="bg-gradient-dark rounded-3xl p-2 grid grid-cols-2 lg:grid-cols-2 gap-2">
                    <button 
                        className="bg-glass shadow-glow-2 rounded-xl p-2 text-white cursor-pointer"
                        onClick={() => setMember(!member)} // Depois fazer clickHandle para fazer o usuario entrar no grupo depois se quiser tambem se desfazer do grupo
                    >
                        {!member ? "Virar membro" : "Sair do grupo"}
                    </button>
                    <button 
                        className="bg-glass shadow-glow-2 rounded-xl p-2 text-white cursor-pointer"
                        onClick={() => navigate(`/group/${groupInfo?.id}`)}
                    >
                        Ver grupo
                    </button>
                </div>

                {/* Abas */}
                <div
                    role="tablist"
                    aria-label="Atividade do perfil"
                    className="bg-gradient-dark rounded-3xl p-2 grid grid-cols-2 lg:grid-cols-4 gap-2"
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
                    className={`flex-1 min-h-64 bg-gradient-dark 
                        rounded-3xl p-6 flex
                        ${!tabContent && "items-center justify-center"}`}
                >
                    <div 
                        className={
                            `flex flex-col 
                            gap-4 text-center text-white ${!tabContent && "items-center"}`
                        }
                    >
                        { tabContent === null ? (
                            <>
                                <div 
                                    className="size-16 rounded-full bg-glass shadow-glow-2 flex items-center justify-center"
                                >
                                    {current.icon}
                                </div>

                                <h2 className="font-huninn text-xl">{current.empty.title}</h2>
                                <p className="text-sm text-white/70">{current.empty.text}</p>
                            </>
                        ) : (
                            <>
                                {Array.isArray(tabContent) ? (
                                    <ul className="grid grid-cols-4 gap-3">
                                        {tabContent.map((item) => (
                                            <>
                                                <li 
                                                    key={item}
                                                    className="bg-black/40 rounded-md px-8 py-2"
                                                >
                                                    {item}
                                                </li>
                                            </>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>{tabContent}</p>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}