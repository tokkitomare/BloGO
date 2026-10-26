import { useState } from "react";
import { handleSearch } from "../handlers/handleSearch";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    
    return (
        <form
            role="search"
            onSubmit={(e) => handleSearch(e, query)}
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
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 px-4 rounded-full cursor-pointer
                            bg-gradient-light text-black text-xs font-medium shadow-glow-3
                            transition-transform duration-150 hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100
                            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                    Procurar
                </button>
            </div>
        </form>
    );
}