import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { ratio, type SortOption } from "./constants";
import { useSort } from "./hooks/useSort";
import { useRequest } from "./hooks/useRequest";
import SortPosts from "./components/SortPosts";
import NoPosts from "./components/NoPosts";
import PostLink from "./components/PostLink";

export default function GroupHome() {
    const { id } = useParams();

    const [sortBy, setSortBy] = useState<SortOption>("relevancy");

    const posts = useSort(
        id,
        sortBy
    );
    const authors = useRequest(posts);

    const sortedPosts =
        sortBy === "relevancy" ? posts.toSorted((a, b) => ratio(b) - ratio(a)) : posts;

    return (
        <main className="w-full lg:w-full h-full px-3 sm:px-5 py-2">
            <title>Início - BloGO</title>

            <div className="flex justify-between">

                <SortPosts
                    onValueChange={setSortBy}
                    sortBy={sortBy}/>

                <Link
                    to={"/post"}
                    state={{ groupId: id }}
                    className="bg-gradient-light shadow-glow-3 rounded-full h-12 w-12 flex items-center justify-center"
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