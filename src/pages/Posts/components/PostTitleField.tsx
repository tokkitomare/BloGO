interface PostTitleFieldProps {
    value: string;
    onChange: (value: string) => void;
}

const MAX_TITLE_LENGTH = 50;

export default function PostTitleField({ value, onChange }: PostTitleFieldProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
                <label htmlFor="post-title" className="text-sm font-medium opacity-70">
                    Título do post
                </label>
                <span className="text-sm font-medium opacity-70">
                    {value.length}/{MAX_TITLE_LENGTH}
                </span>
            </div>
            <input
                id="post-title"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Dê um título ao seu post`}
                autoComplete="off"
                maxLength={MAX_TITLE_LENGTH}
                className="w-full bg-black/5 rounded-tl-2xl rounded-br-2xl border-b-2 border-black px-5 py-4 font-huninn text-2xl sm:text-3xl leading-tight placeholder:text-black/40 selection:bg-black selection:text-white focus:outline-none focus:bg-black/10 transition-colors motion-reduce:transition-none"
            />
        </div>
    );
}