export function toItems(content: unknown): string[] {
    if (Array.isArray(content)) return content as string[];
    if (content) return [String(content)];
    return [];
}