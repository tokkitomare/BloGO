import { useState } from "react";
import CreateTopicModal from "./components/CreateTopicModal";
import ManageTopicsModal from "./components/ManageTopicsModal";
import PostTitleField from "./components/PostTitleField";
import PublishBar from "./components/PublishBar";
import TopicsSection from "./components/TopicsSection";
import { usePublishPost } from "./hooks/usePublishPost";
import { useTopicModals } from "./hooks/useTopicModals";
import { useTopicsDraft } from "./hooks/useTopicsDraft";
import { useLocation } from "react-router-dom";

export default function CreatePost() {
    const [postTitle, setPostTitle] = useState("");

    const location = useLocation();
    const groupId: string | null = location.state?.groupId ?? null;

    const { topicCount, refresh, clear } = useTopicsDraft();
    const modals = useTopicModals(refresh);
    const publishing = usePublishPost({
        title: postTitle,
        topicCount,
        onTopicsRefresh: refresh,
        onTopicsClear: clear,
        groupId,
    });

    return (
        <main className="flex justify-center items-center h-full w-full p-3 sm:p-5">
            <title>Postar - BloGO</title>

            <div className="w-full max-w-4xl min-h-4/5 flex flex-col gap-6 bg-gradient-light text-black p-5 sm:p-8 rounded-tl-3xl rounded-br-3xl">
                <PostTitleField value={postTitle} onChange={setPostTitle} />

                <TopicsSection
                    topicCount={topicCount}
                    onAdd={modals.openCreate}
                    onManage={modals.openManage}
                />

                <PublishBar
                    isReady={publishing.isReady}
                    canSubmit={publishing.canSubmit}
                    isPosting={publishing.isPosting}
                    error={publishing.error}
                    onPublish={publishing.publish}
                    groupId={!!groupId}
                />
            </div>

            <CreateTopicModal
                isOpen={modals.isCreateOpen}
                onClose={modals.closeCreate}
                topic={modals.editingTopic}
            />

            <ManageTopicsModal
                isOpen={modals.isManageOpen}
                onClose={modals.closeManage}
                onEdit={modals.startEditing}
            />
        </main>
    );
}