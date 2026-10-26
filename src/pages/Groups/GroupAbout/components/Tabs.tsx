import { TABS, type TabId } from "../constants";

interface TabsProps {
    itemsByTab: Record<TabId, string[]>,
    activeTab: TabId,
    setActive: (tabId: TabId) => void,
}

export default function Tabs({
    activeTab,
    setActive,
    itemsByTab,
}: TabsProps) {
    return (
        <div
            role="tablist"
            aria-label="Informações do grupo"
            className="bg-gradient-dark rounded-3xl px-3 flex gap-1 overflow-x-auto"
        >
            {TABS.map((tab) => {
                const selected = tab.id === activeTab;
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
    );
}