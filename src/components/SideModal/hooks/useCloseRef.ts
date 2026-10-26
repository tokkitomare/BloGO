import { useEffect, useRef } from "react";

export function useCloseRef(isOpen: boolean) {
    const closeRef = useRef<HTMLButtonElement>(null);
    
    useEffect(() => {
        if (isOpen) closeRef.current?.focus();
    }, [isOpen]);

    return closeRef;
}