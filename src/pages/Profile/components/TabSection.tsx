import type { Tab } from "../constants";

interface TabSectionProps {
    current: Tab;
}

export default function TabSection({ current }: TabSectionProps) {
    return (
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
    );
}