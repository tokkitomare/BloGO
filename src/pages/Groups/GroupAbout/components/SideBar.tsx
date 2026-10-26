import type { Group } from "../../../../types";
import type { TabId } from "../constants";

interface SideBarProps {
    group: Group,
    memberCount: number,
    itemsByTab: Record<TabId, string[]>,
    canViewJoinButton: boolean,
    handleJoinOrLeave: () => Promise<void>,
    isMember: boolean,
}

export default function SideBar({
    group,
    memberCount,
    itemsByTab,
    canViewJoinButton,
    handleJoinOrLeave,
    isMember
}: SideBarProps) {
    return (
        <aside className="flex flex-col gap-4 sm:gap-5 lg:sticky lg:top-5 text-white">
            <section className="bg-gradient-dark rounded-3xl overflow-hidden">
                <h2 className="font-huninn text-lg px-5 py-3 bg-glass">Sobre o grupo</h2>
                <div className="p-5 flex flex-col gap-4">
                    <p className="whitespace-pre-line wrap-break-word">
                        {group.description || "Este grupo ainda não tem descrição."}
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

                    {canViewJoinButton &&
                        <button
                            type="button"
                            className={`w-full rounded-full px-5 py-2 font-medium cursor-pointer
                                        transition-colors duration-200 motion-reduce:transition-none
                                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                                        ${isMember ? "ring-1 ring-white/50 hover:bg-white/10" : "bg-glass shadow-glow-2 hover:bg-white/10"}`}
                            onClick={handleJoinOrLeave}
                        >
                            {isMember ? "Sair do grupo" : "Entrar no grupo"}
                        </button>
                    }
                </div>
            </section>
        </aside>
    );
}