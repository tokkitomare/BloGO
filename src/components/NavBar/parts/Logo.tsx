import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link
            to="/"
            className="justify-self-end md:justify-self-center px-3 py-1
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
            <span className="bg-gradient-light bg-clip-text text-transparent font-huninn font-extrabold text-4xl tracking-[0.8em] select-none">
                BLOGO
            </span>
        </Link>
    );
}