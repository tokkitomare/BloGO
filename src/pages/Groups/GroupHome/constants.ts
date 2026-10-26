import type { Post } from "../../../types";

// DATE

export const fullDate = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

export const relative = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

// SORT

export type SortOption = "relevancy" | "likes" | "views" | "newer" | "older";

export const localized: Record<SortOption, string> = {
    relevancy: "Relevância",
    likes: "Curtidas",
    views: "Visualizações",
    newer: "Mais Recentes",
    older: "Mais Antigos",
};

export const serverSort = {
    likes: { _sort: "likes", _order: "desc" },
    views: { _sort: "views", _order: "desc" },
    newer: { _sort: "date", _order: "desc" },
    older: { _sort: "date", _order: "asc" },
} as const;

export const ratio = (p: Post) => (p.views > 0 ? p.likes / p.views : 0);