export interface Topic {
    id: string;
    title: string;
    description: string;
    images: {
        "0": string | null;
        "1": string | null;
    };
    postId: string | null,
}

export interface Post {
    id: string,
    owner: string,
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
    members: string[] | null,
    mural: string[] | null,
    rules: string | null,
    statistics: string[] | null,
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