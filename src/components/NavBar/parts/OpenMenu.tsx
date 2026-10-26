export default function OpenMenu(
    {setOpenModal}: {setOpenModal: () => void}
) {
    return (
        <button
            type="button"
            onClick={setOpenModal}
            className="size-11 shrink-0 flex items-center justify-center rounded-full cursor-pointer
            bg-gradient-light shadow-glow-3 text-black mix-blend-lighten
            transition-transform duration-150 hover:scale-105 motion-reduce:transition-none 
            motion-reduce:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-black"
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
    );
}