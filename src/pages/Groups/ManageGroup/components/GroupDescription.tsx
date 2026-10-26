interface GroupDescriptionProps {
    newGroupDesc: string;
    onChange: (value: string) => void;
}

export default function GroupDescription({
    newGroupDesc,
    onChange
}: GroupDescriptionProps) {
    return (
        <div className="flex flex-col gap-2 lg:w-7/10 min-h-56 lg:min-h-0">
            <div className="flex items-baseline justify-between">
                <label htmlFor="topic-description" className="text-sm font-medium">
                    Nova descrição
                </label>
                <span className="text-xs text-black/60 tabular-nums">
                    {newGroupDesc.length}/{256}
                </span>
            </div>
            <textarea
                id="topic-description"
                name="description"
                value={newGroupDesc}
                onChange={(e) => onChange(e.target.value)}
                maxLength={256}
                placeholder="Deixe em branco para continuar com a atual"
                className="w-full h-full bg-black/5 rounded-tl-2xl rounded-br-2xl border-t-2 border-black
                            px-5 py-4 font-huninn leading-tight resize-none
                            placeholder:text-black/40 selection:bg-black selection:text-white
                            focus:outline-none focus:bg-black/10 transition-colors motion-reduce:transition-none"
            />
        </div>
    );
}