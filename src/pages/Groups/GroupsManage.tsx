import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { Group, User } from "../../types";
import { api } from "../../lib/api";
import { Link } from "react-router-dom";

export default function GroupsManage() {
    const { user } = useAuth();
    const [dbUser, setDbUser] = useState<User | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        api.get("/users", {
            params: {
                firebaseUid: user?.uid,
            },
        })
            .then(({data}) => setDbUser(data[0] ?? null))
            .catch((e) => console.error(e));
    }, [user]);

    useEffect(() => {
        async function fetchGroups() {
            try {
                const res = await api.get<Group[]>("/groups", {
                    params: {
                        ownerId: dbUser?.id,
                    },
                });
                setGroups(res.data);
            } catch (error) {
                console.error("Erro ao buscar grupos:", error);
            }
        }

        fetchGroups();
    }, [dbUser]);

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