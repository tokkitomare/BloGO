import { useState } from "react";
import SideModal from "../SideModal/SideModal";
import OpenMenu from "./parts/OpenMenu";
import Logo from "./parts/Logo";
import SearchBar from "./parts/SearchBar";

export default function NavBar() {
    const [openModal, setOpenModal] = useState(false);
    
    return (
        <>
            <nav
                aria-label="Principal"
                className="shrink-0 select-none grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr]
                items-center gap-x-4 gap-y-3 px-4 sm:px-10 py-4"
            >
                <OpenMenu setOpenModal={() => setOpenModal(true)} />
            
                <Logo />

                <SearchBar />
            </nav>

            <SideModal isOpen={openModal} onClose={() => setOpenModal(false)} />
        </>
    );
}