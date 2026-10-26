import { ChartSpline, Pin, ScrollText } from "lucide-react";
import type { ReactNode } from "react";

export type TabId = "mural" | "regras" | "estatisticas";

export type Tab = {
    id: TabId;
    label: string;
    icon: ReactNode;
    empty: { title: string; text: string; };
};

export const TABS: Tab[] = [
    {
        id: "mural",
        label: "Mural",
        icon: <Pin strokeWidth={1.5} />,
        empty: {
            title: "Nada fixado por aqui",
            text: "Mensagens, avisos e posts fixados para facilitar as coisas.",
        },
    },
    {
        id: "regras",
        label: "Regras",
        icon: <ScrollText strokeWidth={1.5} />,
        empty: {
            title: "O grupo ainda não tem regras",
            text: "Regras servem para manter as pessoas em conduta.",
        },
    },
    {
        id: "estatisticas",
        label: "Estatísticas",
        icon: <ChartSpline strokeWidth={1.5} />,
        empty: {
            title: "Sem informações",
            text: "Algumas informações e dados públicos sobre o grupo.",
        },
    },
];