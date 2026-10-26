const BASE =
    "font-huninn flex items-center w-full transition-colors duration-150 motion-reduce:transition-none " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const SIZES = {
    main: "gap-3 px-4 py-3 rounded-tl-2xl rounded-br-2xl",
    sub: "px-4 py-2 rounded-tl-xl rounded-br-xl text-sm",
};

const ACTIVE = "bg-glass shadow-glow-2";
const IDLE = {
    main: "text-white/80 hover:bg-white/10 hover:text-white",
    sub: "text-white/70 hover:bg-white/10 hover:text-white",
};

export const itemClass = (active: boolean, size: keyof typeof SIZES = "main") =>
    `${BASE} ${SIZES[size]} ${active ? ACTIVE : IDLE[size]}`;