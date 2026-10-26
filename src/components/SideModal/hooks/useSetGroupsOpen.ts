import { useEffect } from "react";

export function useSetGroupsOpen(isOpen: boolean, setGroupsOpen: (v: boolean) => void) {
    useEffect(() => {
        if (!isOpen) setGroupsOpen(false);
    }, [isOpen]);
}