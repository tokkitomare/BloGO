import type { Post, Topic } from "../../../types";
interface BuildPostParams {
    ownerId: string;
    title: string;
    topics: Topic[];
    groupId?: string | null;
}

export function buildPost({ ownerId, title, topics, groupId = null }: BuildPostParams): Post {
    const id = crypto.randomUUID();

    return {
        id,
        ownerId,
        title: title.trim(),
        date: new Date(),
        topics: topics.map((topic) => ({ ...topic, postId: id })),
        likes: 0,
        views: 0,
        comments: [],
        groupId,
    };
}