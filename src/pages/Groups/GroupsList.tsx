import { Link } from "react-router-dom";
import type { Group } from "../../types";

export default function Groups() {
    const groups: Group[] = JSON.parse(localStorage.getItem("groups") ?? "[]");
    const groupsLen = groups.length;

    console.log(groups)

    return (
        <main className="main-class">
            <title>Grupos - BloGO</title>
            <div className="bg-glass rounded-2xl h-fit grid grid-cols-4 gap-6 p-5">
                {
                    groups.map((v, _) => (
                        <div 
                            className="bg-glass rounded-2xl 
                            p-4 aspect-square shadow-glow-3"
                        >
                            <div 
                                className="ring-4 ring-white/20 bg-black/45
                                flex justify-center items-center 
                                p-5 h-8/10 rounded-2xl shadow-glow-3
                                text-white mb-2"
                            >
                                FOTO ILUSTRATIVA
                            </div>

                            <h1 className="font-huninn text-black font-semibold text-center">
                                {v.name}
                            </h1>
                            <p className="text-black text-center mb-3 truncate">
                                {v.description}
                            </p>

                            <Link 
                                to={`/group/about/${v.id}`} 
                                className="bg-gradient-dark p-3 rounded-2xl w-full flex justify-center items-center"
                            >
                                Ver grupo
                            </Link>
                        </div>
                    ))
                }

                {
                    Array.from({ length: 18-groupsLen }, (_, index) => index).map((_) => (
                        <div 
                            className="bg-glass rounded-2xl 
                            p-4 aspect-square shadow-glow-3"
                        >
                            <div 
                                className="ring-4 ring-white/20 bg-black/45
                                flex justify-center items-center 
                                p-5 h-8/10 rounded-2xl shadow-glow-3
                                text-white mb-2"
                            >
                                FOTO ILUSTRATIVA
                            </div>

                            <h1 className="font-huninn text-black font-semibold text-center">
                                NOME DO GRUPO
                            </h1>
                            <p className="text-black text-center mb-3">
                                DESCRIÇÃO DO GRUPO
                            </p>

                            <button className="bg-gradient-dark p-3 rounded-2xl w-full">
                                Ver grupo
                            </button>
                        </div>
                    ))
                }
            </div>
        </main>
    );
}