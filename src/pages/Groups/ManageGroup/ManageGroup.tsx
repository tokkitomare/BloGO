import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useGetOldGroup } from "./hooks/useGetOldGroup";
import { handleSave } from "./handlers/handleSave";
import { useSubmitWithEnter } from "./hooks/useSubmitWithEnter";
import GroupName from "./components/GroupName";
import GroupDescription from "./components/GroupDescription";
import GroupImage from "./components/GroupImage";
import EditGroup from "./components/EditGroup";

export default function GroupCreate() {
    const { user } = useAuth();
    const { id } = useParams();

    const navigate = useNavigate();

    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupDesc, setNewGroupDesc] = useState("");
    const [newSelectedImage, setNewSelectedImage] = useState("");

    const oldGroup = useGetOldGroup(
        id,
        setNewGroupName,
        setNewGroupDesc,
        setNewSelectedImage,
    );

    const canEdit = newGroupName.trim().length > 0 && newGroupDesc.trim().length > 0 && newSelectedImage.length > 0;

    async function handleEdit() {
        if (
            newGroupName.trim() === oldGroup?.name.trim() &&
            newGroupDesc.trim() === oldGroup?.description.trim() &&
            newSelectedImage.trim() === oldGroup?.photo.trim()
        ) {
            navigate(`/group/about/${id}`);
            return;
        }

        const saved = await handleSave(
            id, canEdit, user,
            oldGroup, newGroupName, newGroupDesc,
            newSelectedImage,
        );

        if (saved && id) {
            navigate(`/group/about/${id}`);
            return;
        }
    }

    useSubmitWithEnter(canEdit, handleEdit);

    return (
        <main className="flex justify-center items-center h-full w-full p-3 sm:p-5">
            <title>Gerenciar Grupo - BloGO</title>

            <div className="w-full max-w-4xl min-h-56 flex flex-col gap-6 bg-gradient-light text-black p-5 sm:p-8 rounded-tl-3xl rounded-br-3xl">
                <GroupName 
                    newGroupName={newGroupName}
                    onChange={setNewGroupName}/>

                <div className="flex flex-row gap-6 flex-1 min-h-0 overflow-y-auto lg:overflow-visible">
                    <GroupDescription 
                        newGroupDesc={newGroupDesc}
                        onChange={setNewGroupDesc}
                    />

                    <GroupImage 
                        setNewSelectedImage={setNewSelectedImage}
                        newSelectedImage={newSelectedImage}
                    />
                </div>


                <EditGroup 
                    canEdit={canEdit}
                    onClick={handleEdit}/>
            </div>
        </main>
    );
}