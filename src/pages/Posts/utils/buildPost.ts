import type { Post, Topic } from "../../../types";
interface BuildPostParams {
    ownerId: string;
    title: string;
    topics: Topic[];
}

export function buildPost({ ownerId, title, topics }: BuildPostParams): Post {
    const id = crypto.randomUUID();

    return {
        id,
        owner: ownerId,
        title: title.trim(),
        date: new Date(),
        topics: topics.map((topic) => ({ ...topic, postId: id })),
        likes: 0,
        views: 0,
        comments: [],
        groupId: null,
    };
}