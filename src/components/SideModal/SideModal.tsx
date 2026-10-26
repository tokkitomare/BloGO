import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useGetUser } from "./hooks/useGetUser";
import { useCloseRef } from "./hooks/useCloseRef";
import { useSetGroupsOpen } from "./hooks/useSetGroupsOpen";
import { useCloseWithEsc } from "./hooks/useCloseWithEsc";
import { useLockOverflow } from "./hooks/useLockOverflow";
import InvisibleDiv from "./parts/InvisibleDiv";
import Header from "./parts/Header";
import Navigator from "./parts/Navigator";
import BlogoSvg from "./parts/BlogoSvg";

interface SideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SideModal({ isOpen, onClose }: SideModalProps) {
    const { user } = useAuth();
    const dbUser = useGetUser(user);

    const [groupsOpen, setGroupsOpen] = useState(false);

    const closeRef = useCloseRef(isOpen);

    useSetGroupsOpen(isOpen, setGroupsOpen);

    useCloseWithEsc(isOpen, onClose);

    useLockOverflow(isOpen);

    return (
        <>
            <InvisibleDiv 
                isOpen={isOpen}
                onClose={onClose}/>

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
                <Header closeRef={closeRef} onClose={onClose} />

                <Navigator 
                    userId={dbUser?.id || "naoexistente"}
                    onClose={onClose}
                    setGroupsOpen={() => setGroupsOpen(!groupsOpen)}
                    groupsOpen={groupsOpen}
                    user={user}
                />


                <BlogoSvg groupsOpen={groupsOpen} />
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