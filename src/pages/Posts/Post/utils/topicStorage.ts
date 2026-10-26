import type { Topic } from "../../../../types";

const TOPICS_KEY = "topics";

function loadList<T>(key: string): T[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function getStoredTopics(): Topic[] {
    return loadList<Topic>(TOPICS_KEY);
}

export function clearStoredTopics(): void {
    localStorage.removeItem(TOPICS_KEY);
}