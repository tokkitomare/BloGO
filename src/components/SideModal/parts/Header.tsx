import { X } from "lucide-react";
import type { RefObject } from "react";

export default function (
    {closeRef, onClose}: {closeRef: RefObject<HTMLButtonElement | null>, onClose: () => void}
) {
    return (
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
    );
}