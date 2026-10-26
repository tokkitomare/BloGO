import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { handleCreate } from "./handlers/handleCreate";
import GroupName from "./components/GroupName";
import GroupDescription from "./components/GroupDescription";
import GroupImage from "./components/GroupImage";
import CreateGroup from "./components/CreateGroup";
import { useSubmitWithEnter } from "./hooks/useSubmitWithEnter";

export default function GroupCreate() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const canCreate = groupName.trim().length > 0 && groupDesc.trim().length > 0 && selectedImage !== null;

    async function handleSubmit() {
        const id = handleCreate(
                canCreate,
                user,
                groupName,
                groupDesc,
                selectedImage ?? "",
        );

        if (id) navigate(`/group/about/${await id}`);
    }

    useSubmitWithEnter(canCreate, handleSubmit)

    return (
        <main className="flex justify-center items-center h-full w-full p-3 sm:p-5">
            <title>Criar Grupo - BloGO</title>
            <div className="w-full max-w-4xl min-h-56 flex flex-col gap-6 bg-gradient-light text-black p-5 sm:p-8 rounded-tl-3xl rounded-br-3xl">

                <GroupName
                    groupName={groupName}
                    onChange={setGroupName}/>

                <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-y-auto lg:overflow-visible">
                    
                    <GroupDescription 
                        groupDesc={groupDesc}
                        onChange={setGroupDesc}/>

                    <GroupImage
                        setSelectedImage={setSelectedImage}
                        selectedImage={selectedImage}
                    />
                </div>


                <CreateGroup 
                    canCreate={canCreate}
                    onClick={handleSubmit}/>
            </div>
        </main>
    );
}