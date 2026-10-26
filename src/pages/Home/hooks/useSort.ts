import { useEffect} from "react";
import { serverSort, type SortOption } from "../constants";
import { api } from "../../../lib/api";
import type { Post } from "../../../types";

export function useSort(sortBy: SortOption, setPosts: (data: Post[]) => void) {
    useEffect(() => {
        let cancelled = false;
        const params = sortBy === "relevancy" ? {} : serverSort[sortBy];

        api.get<Post[]>("/posts", { params }).then(({ data }) => {
            if (!cancelled) setPosts(data);
        });

        return () => {
            cancelled = true;
        };
    }, [sortBy]);
}
