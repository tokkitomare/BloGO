import { api } from "../../../../lib/api";
import type { Post } from "../../../../types";

export async function getPostById(id: string): Promise<Post> {
    const { data } = await api.get<Post>(`/posts/${id}`);
    return data;
}