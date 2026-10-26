import { useEffect, useState } from "react";
import { serverSort, type SortOption } from "../constants";
import type { Group, Post } from "../../../../types";
import { api } from "../../../../lib/api";

export function useSort(
    id: string | undefined,
    sortBy: SortOption,
) {
    const [posts, setPosts] = useState<Post[]>([]);
    
    useEffect(() => {
        let cancelled = false;

        async function fetchPosts() {
            const params = sortBy === "relevancy" ? {} : serverSort[sortBy];

            const { data } = await api.get<Group[]>("/groups", {
                params: {
                    id,
                },
            });

            const group = data[0];

            if (!group) {
                setPosts([]);
                return;
            }

            const { data: posts } = await api.get<Post[]>("/posts", { params });

            if (!cancelled) {
                setPosts(
                    posts.filter(post => post.groupId === group.id)
                );
            }
        }

        fetchPosts();

        return () => {
            cancelled = true;
        };
    }, [sortBy, id]);

    return posts;
}
