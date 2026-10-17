import { useCallback, useState } from "react";
import { clearStoredTopics, getStoredTopics } from "../utils/topicStorage";

/** Controla o rascunho de tópicos guardado no localStorage. */
export function useTopicsDraft() {
    const [topicCount, setTopicCount] = useState(() => getStoredTopics().length);

    const refresh = useCallback(() => {
        setTopicCount(getStoredTopics().length);
    }, []);

    const clear = useCallback(() => {
        clearStoredTopics();
        setTopicCount(0);
    }, []);

    return { topicCount, refresh, clear };
}