import { useState, } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { useFetchUser } from "./hooks/useFetchUser";
import { defaultUser, TABS, type TabId } from "./constants";
import ProfileHeader from "./components/ProfileHeader";
import TabList from "./components/TabList";
import TabSection from "./components/TabSection";

export default function UserProfile() {
    const { id } = useParams<{id: string}>();

    const userData = useFetchUser(id ?? "inexistente");

    const user = userData ?? defaultUser;

    const [active, setActive] = useState<TabId>("grupos");
    const current = TABS.find((t) => t.id === active)!;

    const { loading } = useAuth();

    if (loading) return (
        <main className="main-class"><p>Carregando...</p></main>
    );

    if (!user) return (
        <main className="main-class"><p>Você não está logado</p></main>
    );

    return (
        <main className="w-full min-h-full p-3 sm:p-5 flex">
            <title>Perfil - BloGO</title>

            <div className="w-full bg-gradient-light rounded-tl-4xl rounded-br-4xl p-3 sm:p-6 flex flex-col gap-4 sm:gap-5">
                <ProfileHeader 
                    user={user}/>

                <TabList 
                    active={active}
                    setActive={setActive}/>

                <TabSection current={current} />
                
            </div>
        </main>
    );
}