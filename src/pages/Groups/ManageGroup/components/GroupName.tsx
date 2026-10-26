interface GroupNameProps {
    newGroupName: string;
    onChange: (value: string) => void;
}

export default function GroupName({
    newGroupName,
    onChange,
}: GroupNameProps) {
    return (
        <div className="flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-y-auto lg:overflow-visible">
            <div className="flex items-baseline justify-between">
                <label htmlFor="post-title" className="text-sm font-medium opacity-70">
                    Novo nome do grupo
                </label>
                <span className="text-xs text-black/60 tabular-nums">
                    {newGroupName.length}/{32}
                </span>
            </div>

            <input
                id="post-title"
                type="text"
                value={newGroupName}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Deixe em branco para continuar com o atual"
                autoComplete="off"
                className="w-full bg-black/5 rounded-tl-2xl rounded-br-2xl border-b-2 border-black
                        px-5 py-4 font-huninn text-2xl sm:text-3xl leading-tight
                        placeholder:text-black/40 selection:bg-black selection:text-white
                        focus:outline-none focus:bg-black/10 transition-colors motion-reduce:transition-none"
                maxLength={32}
            />
        </div>
    );
}