import type React from "react";

export function handleSearch(e: React.SubmitEvent, query: string) {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
}