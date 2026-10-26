import { Link } from "react-router-dom";
import type { Post, User } from "../../../../types";
import { fullDate } from "../constants";
import { formatDate } from "../utils/fomatDate";

interface PostLinkProps {
    post: Post;
    author: User;
}

export default function PostLink({ post, author }: PostLinkProps) {
    console.log("Post: ", post);
    console.log("Author: ", author);
    return (
        <Link
            to={`/post/${post.id}`}
            className="group block p-5 rounded-2xl
        bg-white/35 backdrop-blur-md border border-white/30 shadow-glow-3
        transition duration-200 hover:bg-white/50 hover:-translate-y-0.5
        motion-reduce:transition-none motion-reduce:hover:translate-y-0
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
            <article className="flex flex-col gap-3">
                <header className="flex items-center gap-3">
                    <span
                        aria-hidden="true"
                        className="group relative size-10 rounded-full bg-glass shadow-glow-2 overflow-hidden
                            flex items-center justify-center text-white 
                            focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                        {author?.photoUrl && (
                            <img
                                key={author.photoUrl}
                                src={author.photoUrl}
                                alt="Foto de perfil"
                                referrerPolicy="no-referrer"
                                onError={() => {
                                    console.error("Falha ao carregar foto:", author.photoUrl);
                                }}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}
                    </span>
                    <div className="min-w-0 leading-tight">
                        <p className="font-semibold truncate">{author?.displayName ?? "Anônimo"}</p>
                        <time
                            dateTime={new Date(post.date).toISOString()}
                            title={fullDate.format(new Date(post.date))}
                            className="text-sm opacity-65"
                        >
                            {formatDate(post.date)}
                        </time>
                    </div>
                </header>

                <h2 className="text-xl font-bold leading-snug text-balance">
                    {post.title}
                </h2>
            </article>
        </Link>
    );
}