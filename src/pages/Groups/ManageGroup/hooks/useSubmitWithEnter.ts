import { useEffect } from "react";

export function useSubmitWithEnter(
    canEdit: boolean,
    handleEdit: () => void,
) {
    useEffect(() => {
        if (!canEdit) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Enter" || e.shiftKey || e.isComposing || e.target instanceof HTMLTextAreaElement) return;

            e.preventDefault();
            handleEdit();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [canEdit, handleEdit]);
}