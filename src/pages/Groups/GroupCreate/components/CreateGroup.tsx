interface CreateGroupProps {
    canCreate: boolean;
    onClick: () => void;
}

export default function CreateGroup({
    canCreate,
    onClick,
}: CreateGroupProps) {
    return (
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm opacity-70">
                {canCreate ? "Tudo pronto para criar." : "Para criar, informe um nome, adicione uma descrição e selecione a foto do seu grupo."}
            </p>
            <button
                type="button"
                onClick={onClick}
                disabled={!canCreate}
                className="border border-white/45 bg-black/45 text-white 
                        shadow-glow-5 cursor-pointertransition 
                        duration-150 motion-reduce:transition-none hover:bg-black/60 
                        hover:-translate-y-0.5 motion-reduce:hover:translate-y-0
                        focus-visible:outline-2 focus-visible:outline-offset-2
                        focus-visible:outline-black disabled:cursor-not-allowed
                        disabled:opacity-40 disabled:hover:translate-y-0
                        disabled:hover:bg-black/45 font-huninn text-lg px-10 py-3 
                        rounded-tl-2xl rounded-br-2xl cursor-pointer"
            >
                Criar grupo
            </button>
        </div>
    );
}