import { cornerShape, glassButton } from "../styles";

interface TopicsSectionProps {
    topicCount: number;
    onAdd: () => void;
    onManage: () => void;
}

function formatTopicCount(count: number): string {
    if (count === 0) return "Nenhum tópico adicionado";
    if (count === 1) return "1 tópico adicionado";
    return `${count} tópicos adicionados`;
}

export default function TopicsSection({
    topicCount,
    onAdd,
    onManage,
}: TopicsSectionProps) {
    const buttonClass = `${glassButton} ${cornerShape} px-8 py-3`;

    return (
        <section
            aria-labelledby="topics-heading"
            className="flex-1 flex flex-col items-center justify-center gap-5 text-center p-6 sm:p-10 rounded-3xl bg-black/45 border border-white/45 shadow-glow-5 text-white"
        >
            <div className="flex flex-col gap-1">
                <h2 id="topics-heading" className="font-huninn text-2xl">
                    Tópicos
                </h2>

                <p className="text-sm text-white/75" aria-live="polite">
                    {formatTopicCount(topicCount)}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button type="button" onClick={onAdd} className={buttonClass}>
                    Adicionar tópico
                </button>

                <button
                    type="button"
                    onClick={onManage}
                    disabled={topicCount === 0}
                    className={buttonClass}
                >
                    Gerenciar tópicos
                </button>
            </div>
        </section>
    );
}