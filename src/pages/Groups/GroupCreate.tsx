import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Group } from "../../types";

function loadFromStorage<T>(key: string): T[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

const glassButton = `border border-white/45 bg-black/45 text-white shadow-glow-5 cursor-pointer
    transition duration-150 motion-reduce:transition-none
    hover:bg-black/60 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black
    disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-black/45`;

export default function GroupCreate() {
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState("");
    const [groupDesc, setGroupDesc] = useState("");

    const canCreate = groupName.trim().length > 0 && groupDesc.trim().length > 0;

    function handleSave(): string {

        const newGroup: Group = {
            id: crypto.randomUUID(),
            owner: "Usuário Teste",
            name: groupName,
            description: groupDesc,
            members: ["Usuário Teste"],
            mural: null,
            rules: null,
            statistics: null,
            photo: "",
            // members: ["Vitor", "Gabriel", "Miguel", "Arthur", "Heitor",
            //         "Bernardo", "Davi", "Lucas", "Matheus", "Rafael",
            //         "Leonardo", "Henrique", "Gustavo", "Felipe", "Nicolas",
            //         "Samuel", "Enzo", "Benjamin", "Pedro", "Daniel",
            //         "Eduardo", "Murilo", "Lorenzo", "Theo", "Caio",
            //         "Bruno", "Andre", "Vinicius", "Joaquim", "Otavio",
            //         "Alice", "Sophia", "Helena", "Laura", "Valentina",
            //         "Manuela", "Isabella", "Heloisa", "Julia", "Cecilia",
            //         "Maite", "Livia", "Beatriz", "Maria", "Lorena",
            //         "Giovanna", "Luisa", "Clara", "Mariana", "Isadora",
            //         "Amanda", "Camila", "Larissa", "Leticia", "Yasmin",
            //         "Ana", "Gabriela", "Rebeca", "Eloisa", "Esther",
            //         "Alex", "Ariel", "Noah", "Luca", "Ryan",
            //         "Ian", "Erick", "Diego", "Thiago", "Igor",
            //         "Leon", "Cauã", "Breno", "Danilo", "Rodrigo",
            //         "Fernando", "Marcelo", "Ricardo", "Anderson", "Roberto",
            //         "Patricia", "Vanessa", "Priscila", "Bianca", "Carolina",
            //         "Débora", "Eduarda", "Fernanda", "Isabel", "Mirela",
            //         "Nicole", "Raquel", "Sabrina", "Taina", "Vitória",
            //         "Melissa", "Olivia", "Antonella", "Agatha", "Stella"
            // ],
            // mural: ["Aviso 1", "Aviso 2", "Aviso 3"],
            // rules: "Respeite todos\ncompartilhe conhecimento\najude\nteste",
            // statistics: ["Metrica 1", "Metrica 2", "Metrica 3", "Metrica 4", "Metrica 5", "Metrica 6"]
        };

        const storedGroups = loadFromStorage<Group>("groups");
        storedGroups.push(newGroup);

        localStorage.setItem("groups", JSON.stringify(storedGroups));

        return newGroup.id;
    }

    function handleSubmit() {
        const id = handleSave();
        if (id) navigate(`/group/about/${id}`);
    }

    useEffect(() => {
        if (!canCreate) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Enter" || e.shiftKey || e.isComposing || e.target instanceof HTMLTextAreaElement) return;
        
            e.preventDefault();
            handleSubmit();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [canCreate, handleSubmit]);

    return (
        <main className="flex justify-center items-center h-full w-full p-3 sm:p-5">
            <title>Criar Grupo - BloGO</title>
            <div className="w-full max-w-4xl min-h-4/5 flex flex-col gap-6 bg-gradient-light text-black p-5 sm:p-8 rounded-tl-3xl rounded-br-3xl">
                <div className="flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-y-auto lg:overflow-visible">
                    <div className="flex items-baseline justify-between">
                        <label htmlFor="post-title" className="text-sm font-medium opacity-70">
                            Nome do grupo
                        </label>
                        <span className="text-xs text-black/60 tabular-nums">
                            {groupName.length}/{32}
                        </span>
                    </div>

                    <input
                        id="post-title"
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Dê um nome ao seu grupo (32 letras máx.)"
                        autoComplete="off"
                        className="w-full bg-black/5 rounded-tl-2xl rounded-br-2xl border-b-2 border-black
                        px-5 py-4 font-huninn text-2xl sm:text-3xl leading-tight
                        placeholder:text-black/40 selection:bg-black selection:text-white
                        focus:outline-none focus:bg-black/10 transition-colors motion-reduce:transition-none"
                        maxLength={32}
                    />
                </div>

                <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-y-auto lg:overflow-visible">
                    <div className="flex flex-col gap-2 lg:w-7/10 min-h-56 lg:min-h-0">
                        <div className="flex items-baseline justify-between">
                            <label htmlFor="topic-description" className="text-sm font-medium">
                                Descrição
                            </label>
                            <span className="text-xs text-black/60 tabular-nums">
                                {groupDesc.length}/{256}
                            </span>
                        </div>
                        <textarea
                            id="topic-description"
                            name="description"
                            value={groupDesc}
                            onChange={(e) => setGroupDesc(e.target.value)}
                            maxLength={256}
                            placeholder="Descreva seu grupo"
                            className="w-full h-full bg-black/5 rounded-tl-2xl rounded-br-2xl border-t-2 border-black
                            px-5 py-4 font-huninn leading-tight resize-none
                            placeholder:text-black/40 selection:bg-black selection:text-white
                            focus:outline-none focus:bg-black/10 transition-colors motion-reduce:transition-none"
                        />
                    </div>

                    <div className="flex flex-col gap-3 lg:flex-1">
                        <p className="text-sm font-medium">Imagem do grupo</p>

                        <button
                            type="button"
                            disabled
                            title="Em breve"
                            aria-label="Adicionar imagens (em breve)"
                            className="flex flex-col items-center justify-center gap-1 w-full aspect-3/2
                            rounded-2xl shadow-lg text-neutral-700 disabled:cursor-not-allowed 
                            disabled:opacity-70 bg-black/5 border-2 border-black
                            px-5 py-4 font-huninn leading-tight resize-none
                            placeholder:text-black/40 selection:bg-black"
                        >
                            <span className="text-4xl font-light leading-none">+</span>
                            <span className="text-xs">Em breve</span>
                        </button>
                    </div>
                </div>

                
                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm opacity-70">
                        {canCreate ? "Tudo pronto para criar." : "Para criar, informe um nome e adicione uma descrição."}
                    </p>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!canCreate}
                        className={`${glassButton} font-huninn text-lg px-10 py-3 rounded-tl-2xl rounded-br-2xl`}
                    >
                        Criar grupo
                    </button>
                </div>
            </div>
        </main>
    );
}