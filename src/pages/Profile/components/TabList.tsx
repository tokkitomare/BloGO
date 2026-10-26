import { TABS, type TabId } from "../constants";

interface TabListProps {
    active: TabId;
    setActive: (tabId: TabId) => void;
}

export default function TabList({ active, setActive }: TabListProps) {
    return (
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
    );
}