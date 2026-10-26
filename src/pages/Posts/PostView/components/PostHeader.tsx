import { Link } from "react-router-dom";
import { formatPostDate } from "../utils/dateFormatter";
import type { PostHeaderProps } from "../interfaces";



export default function PostHeader({ user, title, date }: PostHeaderProps) {
    return (
        <header className="mb-6 flex flex-col gap-4">
            <div className="grid grid-cols-[3fr_7fr] gap-3">
                <div className="flex items-center gap-3">
                    <Link
                        to={`/profile/${user.id}`}
                        aria-hidden="true"
                        className="group relative size-10 rounded-full bg-glass shadow-glow-2 overflow-hidden
                            flex items-center justify-center text-white 
                            focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                        {user.photoUrl && (
                                <img
                                    key={user.photoUrl}
                                    src={user.photoUrl}
                                    alt="Foto de perfil"
                                    referrerPolicy="no-referrer"
                                    onLoad={() => console.log("Foto carregada:", user.photoUrl)}
                                    onError={() => {
                                        console.error("Falha ao carregar foto:", user.photoUrl);
                                    }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            )}
                    </Link>

                    <p className="leading-tight">
                        <span className="font-semibold">{user.displayName}</span>
                        <br />
                        <time
                            dateTime={new Date(date).toISOString()}
                            className="text-sm opacity-70"
                        >
                            {formatPostDate(date)}
                        </time>
                    </p>
                </div>

                <h1 className="wrap-anywhere font-huninn font-extrabold text-3xl sm:text-4xl leading-tight text-balance text-shadow-[0_0_8px]">
                    {title}
                </h1>
            </div>
        </header>
    );
}