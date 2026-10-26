import type { Topic } from "../../../../types";
import { topicDomId } from "../utils/dateFormatter";

export default function PostContent({ topics }: { topics: Topic[] }) {
    return (
        <article className="bg-glass rounded-tl-3xl rounded-br-3xl p-5 sm:p-8 flex flex-col gap-12">
            {topics.length === 0 ? (
                <p className="opacity-70">Este post ainda não tem conteúdo.</p>
            ) : (
                topics.map((topic) => (
                    <section
                        key={topic.id}
                        id={topicDomId(topic.id)}
                        className="scroll-mt-6"
                    >
                        <h2 className="white-space font-huninn font-bold text-2xl sm:text-3xl mb-4 text-shadow-[0_0_8px]">
                            {topic.title}
                        </h2>
                        <p className="wrap-anywhere leading-relaxed max-w-[70ch] whitespace-pre-line">
                            {topic.description}
                        </p>
                    </section>
                ))
            )}
        </article>
    );
}