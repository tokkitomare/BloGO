import { useState } from "react";
import type { Topic } from "../../../types";

/** Controla a abertura dos modais de criar/gerenciar tópicos e a edição. */
export function useTopicModals(onTopicsChange: () => void) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isManageOpen, setIsManageOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

    function openCreate() {
        setEditingTopic(null);
        setIsCreateOpen(true);
    }

    function openManage() {
        setIsManageOpen(true);
    }

    function startEditing(topic: Topic) {
        setEditingTopic(topic);
        setIsManageOpen(false);
        setIsCreateOpen(true);
    }

    function closeCreate() {
        const wasEditing = editingTopic !== null;

        setIsCreateOpen(false);
        setEditingTopic(null);
        onTopicsChange();

        // Voltar para a lista depois de editar.
        if (wasEditing) setIsManageOpen(true);
    }

    function closeManage() {
        setIsManageOpen(false);
        onTopicsChange();
    }

    return {
        isCreateOpen,
        isManageOpen,
        editingTopic,
        openCreate,
        openManage,
        startEditing,
        closeCreate,
        closeManage,
    };
}