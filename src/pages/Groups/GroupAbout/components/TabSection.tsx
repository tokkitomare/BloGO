import { type Tab } from "../constants";

interface TabSectionProps {
    current: Tab,
    items: string[],
}

export default function TabSection({
    current,
    items,
}: TabSectionProps) {
    return (
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
    );
}