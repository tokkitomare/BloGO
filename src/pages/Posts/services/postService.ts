import type { Post } from "../../../types";
import { api } from "../../../lib/api";

export async function createPost(post: Post): Promise<void> {
    await api.post("/posts", post);
}