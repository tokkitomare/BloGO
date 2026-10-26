import { useEffect } from "react";

export function useSubmitWithEnter(
    canCreate: boolean,
    handleSubmit: () => void,
) {
    useEffect(() => {
        if (!canCreate) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Enter" || e.shiftKey || e.isComposing || e.target instanceof HTMLTextAreaElement) return;

            e.preventDefault();
            handleSubmit();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [canCreate, handleSubmit]);
}