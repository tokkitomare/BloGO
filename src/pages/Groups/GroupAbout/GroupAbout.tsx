import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useGetGroup } from "./hooks/useGetGroup";
import { useGetUser } from "./hooks/useGetUser";
import { useSetMember } from "./hooks/useSetMember";
import { TABS, type TabId } from "./constants";
import { toItems } from "./utils/toItems";
import { handleJoinOrLeaveService } from "./services/handleJoinOrLeaveService";
import GroupAboutHeader from "./components/GroupAboutHeader";
import Tabs from "./components/Tabs";
import TabSection from "./components/TabSection";
import SideBar from "./components/SideBar";

export default function GroupAbout() {
    const { user } = useAuth();
    const { id } = useParams();

    const navigate = useNavigate();

    const [active, setActive] = useState<TabId>("mural");

    const groupInfo = useGetGroup(id);
    const dbUser = useGetUser(user?.uid);
    const member = useSetMember(id, user, dbUser);

    if (!groupInfo) return;

    const current = TABS.find((t) => t.id === active)!;

    const itemsByTab: Record<TabId, string[]> = {
        mural: toItems(groupInfo.mural),
        regras: toItems(groupInfo.rules),
        estatisticas: toItems(groupInfo.statistics),
    };

    const items = itemsByTab[current.id];
    const memberCount = groupInfo.members?.length ?? 0;

    return (
        <main className="w-full min-h-full p-3 sm:p-5 flex">
            <title>{`${groupInfo.name} - BloGO`}</title>
            <div className="w-full bg-gradient-light rounded-tl-4xl rounded-br-4xl p-3 sm:p-6 flex flex-col gap-4 sm:gap-5">
                <GroupAboutHeader 
                    group={groupInfo}
                    handleJoinOrLeave={() =>
                        handleJoinOrLeaveService(
                            user, 
                            groupInfo, 
                            dbUser, 
                            member, 
                            id,
                            navigate
                        )
                    }
                    canViewJoinButton={!user || groupInfo.ownerId !== dbUser?.id}
                    isMember={member}
                    memberCount={memberCount}
                    sendTo={`/group/${id}`}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_20rem] gap-4 sm:gap-5 items-start">
                    <div className="flex flex-col gap-4 sm:gap-5 min-w-0">
                        <Tabs
                            itemsByTab={itemsByTab} 
                            activeTab={active}
                            setActive={setActive}
                        />

                        <TabSection
                            items={items}
                            current={current}
                        />
                    </div>

                    <SideBar 
                        group={groupInfo}
                        handleJoinOrLeave={() => 
                            handleJoinOrLeaveService(
                                user, 
                                groupInfo, 
                                dbUser, 
                                member, 
                                id,
                                navigate
                            )
                        }
                        canViewJoinButton={!user || groupInfo.ownerId !== dbUser?.id}
                        isMember={member}
                        itemsByTab={itemsByTab}
                        memberCount={memberCount}
                    />
                </div>
            </div>
        </main>
    );
}