export interface Topic {
    id: string;
    title: string;
    description: string;
    postId: string | null,
}

export interface Post {
    id: string,
    ownerId: string,
    title: string,
    date: Date,
    topics: Topic[],
    likes: number,
    views: number,
    comments: string[],
    groupId: string | null,
}

export interface Group {
    id: string,
    ownerId: string,
    name: string,
    description: string,
    photo: string,
    members: string[],
    mural: string[],
    rules: string[],
    statistics: string[],
    posts: string[],
}

export interface User {
    photoUrl: string | undefined;
    id: string;
    firebaseUid: string;
    displayName: string;
    email: string;
    groups: string[];
    posts: string[];
    savedPosts: string[];
}

export interface GoogleSession {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoUrl: string | null;
    firebaseIdToken: string;
}