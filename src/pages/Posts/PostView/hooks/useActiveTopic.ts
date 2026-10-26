import { useEffect, useState } from "react";
import type { Topic } from "../../../../types";
import { topicDomId, topicIdFromDomId } from "../utils/dateFormatter";

export function useActiveTopic(topics: Topic[]) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        if (topics.length === 0) return;

        setActiveId(topics[0].id);

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible) setActiveId(topicIdFromDomId(visible.target.id));
            },
            { rootMargin: "-10% 0px -70% 0px" }
        );

        topics.forEach((topic) => {
            const element = document.getElementById(topicDomId(topic.id));
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [topics]);

    return activeId;
}
