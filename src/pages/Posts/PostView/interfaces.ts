import type { Topic, User } from "../../../types";

export interface PostHeaderProps {
    user: User,
    title: string;
    date: string | Date;
}

export interface TopicsNavProps {
    topics: Topic[];
    activeId: string | null;
}