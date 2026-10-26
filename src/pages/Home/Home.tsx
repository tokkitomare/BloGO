import { useState } from "react";
import { Link } from "react-router-dom";
import type { Post, User } from "../../types";
import { Pencil } from "lucide-react";
import { ratio, type SortOption } from "./constants";
import SortPosts from "./components/SortPosts";
import NoPosts from "./components/NoPosts";
import PostLink from "./components/PostLink";
import { useSort } from "./hooks/useSort";
import { useRequest } from "./hooks/useRequest";

export default function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [authors, setAuthors] = useState<Record<string, User>>({});
    const [sortBy, setSortBy] = useState<SortOption>("relevancy");
    
    useSort(sortBy, setPosts);
    useRequest(posts, setAuthors);

    const sortedPosts =
        sortBy === "relevancy" ? posts.toSorted((a, b) => ratio(b) - ratio(a)) : posts;

    return (
        <main className="w-full lg:w-full h-full px-3 sm:px-5 py-2">
            <title>Início - BloGO</title>

            <div className="flex justify-between">
                <SortPosts 
                    sortBy={sortBy}
                    onValueChange={setSortBy}
                />

                <Link
                    to={"/post"}
                    className="bg-gradient-light shadow-glow-3 
                    rounded-full h-12 w-12 flex items-center 
                    justify-center"
                >
                    <Pencil
                        strokeWidth={1.5}
                        size={24}
                        className="transition-transform text-black"
                    />
                </Link>
            </div>

            {posts.length === 0 ? (
                <NoPosts />
            ) : (
                <ul className="flex flex-col gap-4">
                    {sortedPosts.map((post) => (
                        <li key={post.id}>
                            <PostLink
                                post={post}
                                author={authors[post.ownerId]}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}