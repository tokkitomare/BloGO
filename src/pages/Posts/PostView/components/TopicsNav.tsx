import type { TopicsNavProps } from "../interfaces";
import { linkActive, linkBase, linkIdle } from "../style";
import { topicDomId } from "../utils/dateFormatter";

export default function TopicsNav({ topics, activeId }: TopicsNavProps) {
    return (
        <nav
            aria-label="Sumário do post"
            className="lg:sticky lg:top-5 bg-glass text-white p-3 rounded-tl-3xl rounded-br-3xl shadow-glow-3"
        >
            <p className="px-3 pt-2 pb-3 font-huninn text-lg">Neste post</p>

            <ul className="flex flex-col gap-1">
                {topics.map((topic) => {
                    const isCurrent = topic.id === activeId;

                    return (
                        <li key={topic.id}>
                            <a
                                href={`#${topicDomId(topic.id)}`}
                                aria-current={isCurrent ? "true" : undefined}
                                className={`${linkBase} ${isCurrent ? linkActive : linkIdle}`}
                            >
                                {topic.title}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}