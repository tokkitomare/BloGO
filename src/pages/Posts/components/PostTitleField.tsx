interface PostTitleFieldProps {
    value: string;
    onChange: (value: string) => void;
}

const MAX_TITLE_LENGTH = 50;

export default function PostTitleField({ value, onChange }: PostTitleFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="post-title" className="text-sm font-medium opacity-70">
                Título do post
            </label>

            <input
                id="post-title"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Dê um título ao seu post (${MAX_TITLE_LENGTH} letras máx.)`}
                autoComplete="off"
                maxLength={MAX_TITLE_LENGTH}
                className="w-full bg-black/5 rounded-tl-2xl rounded-br-2xl border-b-2 border-black px-5 py-4 font-huninn text-2xl sm:text-3xl leading-tight placeholder:text-black/40 selection:bg-black selection:text-white focus:outline-none focus:bg-black/10 transition-colors motion-reduce:transition-none"
            />
        </div>
    );
}