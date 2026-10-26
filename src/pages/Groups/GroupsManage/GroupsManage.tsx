import { useAuth } from "../../../contexts/AuthContext";
import { useFetchUser } from "./hooks/useFetchUser";
import { useFetchGroups } from "./hooks/useFetchGroups";
import { Link } from "react-router-dom";

export default function GroupsManage() {
    const { user } = useAuth();
    
    const dbUser = useFetchUser(user);
    const groups = useFetchGroups(dbUser);

    return (
        <main className="main-class">
            <title>Gerenciar Grupos - BloGO</title>
            
            <div
                className="bg-glass rounded-2xl h-fit grid gap-4 p-5"
                style={{
                    gridTemplateColumns: `repeat(${Math.min(groups.length || 1, 4)}, minmax(0, 1fr))`
                }}
            >
                {
                    groups.map((v, _) => (
                        <div
                            key={v.id}
                            className="bg-glass rounded-2xl 
                            p-4 aspect-square shadow-glow-3"
                        >
                            <div
                                className="ring-4 ring-white/20 bg-black/45
                                flex justify-center items-center 
                                p-5 h-8/10 rounded-2xl shadow-glow-3
                                text-white mb-2"
                            >
                                <img src={v.photo} className="rounded-2xl h-full w-full" />
                            </div>

                            <h1 className="font-huninn text-black font-semibold text-center truncate">
                                {v.name}
                            </h1>
                            <p className="text-black text-center mb-3 truncate">
                                {v.description}
                            </p>

                            <Link
                                to={`/group/manage/${v.id}`}
                                className="bg-gradient-dark p-3 rounded-2xl w-full flex justify-center items-center"
                            >
                                Gerenciar grupo
                            </Link>
                        </div>
                    ))
                }
            </div>
        </main>
    );
}