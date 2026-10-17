import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import SideModal from "./SideModal";

const focusRing =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export default function NavBar() {
    const [openModal, setOpenModal] = useState(false);
    const [query, setQuery] = useState("");

    function handleSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const term = query.trim();
        if (!term) return;
    }

    return (
        <>
            <nav
                aria-label="Principal"
                className="shrink-0 select-none grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr]
                items-center gap-x-4 gap-y-3 px-4 sm:px-10 py-4"
            >
                {/* Menu + entrar */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setOpenModal(true)}
                        aria-label="Abrir menu"
                        aria-haspopup="dialog"
                        aria-expanded={openModal}
                        className={`size-11 shrink-0 flex items-center justify-center rounded-full cursor-pointer
                        bg-gradient-light shadow-glow-3 text-black mix-blend-lighten
                        transition-transform duration-150 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100
                        ${focusRing}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            aria-hidden="true"
                        >
                            <path d="M4 7h16" />
                            <path d="M4 12h16" />
                            <path d="M4 17h16" />
                        </svg>
                    </button>

                    {/* <Link
                        to="/login"
                        className={`inline-flex items-center h-fit px-5 shrink-0 rounded-full font-medium
                        bg-gradient-light shadow-glow-3 text-black mix-blend-lighten
                        transition-transform duration-150 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100
                        ${focusRing}`}
                    >
                        Entrar
                    </Link> */}
                </div>

                {/* Logo */}
                <Link
                    to="/"
                    aria-label="blogo logo"
                    className={`justify-self-end md:justify-self-center px-3 py-1
                    ${focusRing}`}
                >
                    <span className="bg-gradient-light bg-clip-text text-transparent font-huninn font-extrabold text-4xl tracking-[0.8em] select-none">
                        BLOGO
                    </span>
                </Link>

                {/* Busca */}
                <form
                    role="search"
                    onSubmit={handleSearch}
                    className="col-span-2 md:col-span-1 md:justify-self-end w-full max-w-sm md:ml-auto"
                >
                    <label htmlFor="search" className="sr-only">
                        Pesquisar
                    </label>

                    <div className="relative">
                        <svg
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-black/60 pointer-events-none"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="2"
                                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                            />
                        </svg>

                        <input
                            type="search"
                            id="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Pesquisar"
                            autoComplete="off"
                            className="block w-full h-11 ps-10 pe-28 text-sm text-black placeholder:text-black/60
                            bg-white/35 backdrop-blur-md border border-white/30 shadow-glow-3
                            rounded-tr-2xl rounded-bl-2xl
                            [&::-webkit-search-cancel-button]:appearance-none
                            focus:outline-none focus:bg-white/55 focus:border-white/60
                            transition-colors motion-reduce:transition-none"
                        />

                        <button
                            type="submit"
                            className={`absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-4 rounded-full cursor-pointer
                            bg-gradient-light text-black text-xs font-medium shadow-glow-3
                            transition-transform duration-150 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100
                            ${focusRing}`}
                        >
                            Procurar
                        </button>
                    </div>
                </form>
            </nav>

            <SideModal isOpen={openModal} onClose={() => setOpenModal(false)} />
        </>
    );
}