import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

import { User as UserLucide, Pencil, UserGroup, ChevronDown, LogOut, LogIn, Settings, X } from "lucide-react";
import { api } from "../lib/api";

interface SideModalProps {
    isOpen: boolean;
    onClose: () => void;
    isGroupOwner?: boolean
}

const linkBase = `font-huninn flex items-center gap-3 w-full px-4 py-3 rounded-tl-2xl rounded-br-2xl
    transition-colors duration-150 motion-reduce:transition-none
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`;

export default function SideModal({ isOpen, onClose }: SideModalProps) {
    const { user } = useAuth();
    const [userId, setUserId] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.uid) {
            setUserId(null);
            return;
        }

        api.get("/users", {
            params: {
                firebaseUid: user.uid,
            },
        })
            .then(({ data }) => {
                setUserId(data[0]?.id ?? null);
            })
            .catch((err) => {
                console.error(err);
                setUserId(null);
            })
    }, [user?.uid]);

    async function handleAuthAction() {
        onClose();

        if (!user) { navigate("/login"); return; }

        try {
            await signOut(auth);

            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Erro ao sair da conta:", error);
            alert("Não foi possível sair da conta. Tente novamente.");
        }
    }


    const closeRef = useRef<HTMLButtonElement>(null);
    const { pathname } = useLocation();
    const [groupsOpen, setGroupsOpen] = useState(false);

    const profileActive = pathname.startsWith("/profile");
    const postActive = pathname.startsWith("/post");
    const groupsActive = pathname.startsWith("/groups");
    const configsActive = pathname.startsWith("/configs");

    const groupsLinks = [
        { label: "Procurar grupos", to: "/groups/search" },
        { label: "Criar grupo", to: "/groups/create" },
        { label: "Gerenciar grupo", to: "/groups/manage" },
    ];

    // Foca no botão de fechar ao abrir
    useEffect(() => {
        if (isOpen) closeRef.current?.focus();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) setGroupsOpen(false);
    }, [isOpen]);

    // Fecha com Esc
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen, onClose]);

    // Trava a rolagem da página enquanto o menu está aberto
    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    return (
        <>
            <div
                onClick={onClose}
                aria-hidden="true"
                className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm
                transition-opacity duration-300 motion-reduce:transition-none
                ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />

            <aside
                role="dialog"
                aria-modal="true"
                aria-labelledby="side-menu-title"
                aria-hidden={!isOpen}
                className={`fixed top-0 left-0 z-50 h-dvh w-full sm:w-80
                flex flex-col gap-6 p-6
                bg-gradient-dark shadow-glow-3 text-white
                sm:rounded-r-3xl
                transition duration-200 ease-out motion-reduce:transition-none
                ${isOpen ? "translate-x-0" : "-translate-x-full invisible pointer-events-none"}`}
            >
                <div className="flex items-center justify-between">
                    <h2 id="side-menu-title" className="select-none font-huninn text-2xl">
                        Menu
                    </h2>

                    <button
                        ref={closeRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar menu"
                        className="size-10 flex items-center justify-center rounded-full cursor-pointer
                        transition duration-150 hover:bg-white/35 hover:rotate-90
                        motion-reduce:transition-none motion-reduce:hover:rotate-0
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                        <X strokeWidth={1.5} />
                    </button>
                </div>

                <nav aria-label="Menu lateral">
                    <ul className="flex flex-col gap-2">
                        <li>
                            <NavLink
                                to={`/profile/${userId}`}
                                onClick={onClose}
                                className={`font-huninn flex items-center gap-3 w-full px-4 py-3 rounded-tl-2xl rounded-br-2xl
                                    transition-colors duration-150 motion-reduce:transition-none
                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                                    ${profileActive ? "bg-glass shadow-glow-2" : "text-white/80 hover:bg-white/10 hover:text-white"}`
                                }
                            >
                                <UserLucide
                                    strokeWidth={1.5} />

                                <span className="flex-1 text-left">Perfil</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to={`/post`}
                                onClick={onClose}
                                className={`font-huninn flex items-center gap-3 w-full px-4 py-3 rounded-tl-2xl rounded-br-2xl
                                    transition-colors duration-150 motion-reduce:transition-none
                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                                    ${postActive ? "bg-glass shadow-glow-2" : "text-white/80 hover:bg-white/10 hover:text-white"}`
                                }
                            >
                                <Pencil
                                    strokeWidth={1.5} />

                                <span className="flex-1 text-left">Postar</span>
                            </NavLink>
                        </li>

                        <li>
                            <button
                                type="button"
                                onClick={() => setGroupsOpen(!groupsOpen)}
                                aria-expanded={groupsOpen}
                                aria-controls="groups-submenu"
                                className={`${linkBase} cursor-pointer
                                ${groupsActive ? "bg-glass shadow-glow-2" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
                            >

                                <UserGroup
                                    strokeWidth={1.5}
                                />

                                <span className="flex-1 text-left">Grupos</span>

                                <ChevronDown
                                    size={16}
                                    className={`transition-transform ${groupsOpen ? `rotate-180` : `rotate-0`}`}
                                />
                            </button>

                            <div
                                id="groups-submenu"
                                className={`grid transition-[grid-template-rows,visibility] duration-200 ease-out
                                motion-reduce:transition-none
                                ${groupsOpen ? "grid-rows-[1fr] visible" : "grid-rows-[0fr] invisible"}`}
                            >
                                <ul className="overflow-hidden flex flex-col gap-1 pl-6">
                                    {groupsLinks.map(({ label, to }) => (
                                        <li key={to} className="first:mt-2">
                                            <NavLink
                                                to={to}
                                                onClick={onClose}
                                                className={({ isActive }) =>
                                                    `font-huninn flex items-center w-full px-4 py-2 rounded-tl-xl rounded-br-xl text-sm
                                                    transition-colors duration-150 motion-reduce:transition-none
                                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                                                    ${isActive ? "bg-glass shadow-glow-2" : "text-white/70 hover:bg-white/10 hover:text-white"}`
                                                }
                                            >
                                                {label}
                                            </NavLink>
                                        </li>
                                    ))}

                                </ul>
                            </div>
                        </li>

                        <li>
                            <NavLink
                                to={`/configuration`}
                                onClick={onClose}
                                className={`font-huninn flex items-center gap-3 w-full px-4 py-3 rounded-tl-2xl rounded-br-2xl
                                    transition-colors duration-150 motion-reduce:transition-none
                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                                    ${configsActive ? "bg-glass shadow-glow-2" : "text-white/80 hover:bg-white/10 hover:text-white"}`
                                }
                            >
                                <Settings strokeWidth={1.5} />

                                <span className="flex-1 text-left">Configurações</span>
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to={"/login"}
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    void handleAuthAction();
                                }}
                                className={({ isActive }) =>
                                    `font-huninn flex items-center gap-3 w-full px-4 py-3 rounded-tl-2xl rounded-br-2xl
                                    transition-colors duration-150 motion-reduce:transition-none
                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                                    ${isActive ? "bg-glass shadow-glow-2" : "text-white/80 hover:bg-white/10 hover:text-white"}`
                                }
                            >
                                {user ? (
                                    <LogOut strokeWidth={1.5} />
                                ) : (
                                    <LogIn strokeWidth={1.5} />
                                )}
                                {user ? "Sair" : "Entrar"}
                            </NavLink>
                        </li>
                    </ul>
                </nav>


                <div className="absolute bottom-4 left-0 w-full flex justify-center">
                    <div
                        className={`absolute bottom-0 left-0 w-full flex justify-center transition-transform duration-150 ease-in-out ${groupsOpen
                                ? "scale-50 translate-y-16"
                                : "scale-100 translate-y-0"
                            }`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1080 1080"
                            fill="#fff"
                            className="w-1/2"
                        >
                            <path d="M356 180h41c32 0 55 22 55 55v216c0 15-10 25-20 37-16 20-6 69 7 97 21 46 67 63 115 63 67 0 117-45 117-111 0-54-26-106-59-130-9-7-10-10-10-24v-41c0-12-6-16 5-13 93 22 157 113 157 208 0 115-90 209-206 209-114 0-205-92-205-207 0-21 2-44 2-70V184c0-3 1-4 1-4z" />
                            <path d="M547 336h16c10 0 16 6 16 16v189c0 10-7 17-17 17h-15c-10 0-17-7-17-17V352c0-10 7-16 17-16z" />

                        </svg>
                    </div>
                </div>

            </aside>
        </>
    );
}








{/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" role="img" aria-label="Símbolo dourado">
    <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stop-color="#ffe9a3"/>
        <stop offset="48%" stop-color="#d5a44e"/>
        <stop offset="100%" stop-color="#ad702b"/>
        </linearGradient>
    </defs>
    <rect width="1080" height="1080" fill="#0b0b0b"/>
    <path fill="url(#gold)" d="M356 180h41c32 0 55 22 55 55v216c0 15-10 25-20 37-16 20-6 69 7 97 21 46 67 63 115 63 67 0 117-45 117-111 0-54-26-106-59-130-9-7-10-10-10-24v-41c0-12-6-16 5-13 93 22 157 113 157 208 0 115-90 209-206 209-114 0-205-92-205-207 0-21 2-44 2-70V184c0-3 1-4 1-4z"/>
    <path fill="#fff" d="M547 336h16c10 0 16 6 16 16v189c0 10-7 17-17 17h-15c-10 0-17-7-17-17V352c0-10 7-16 17-16z"/>
</svg> */}