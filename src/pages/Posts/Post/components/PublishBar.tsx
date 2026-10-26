import { cornerShape, glassButton } from "../styles";

interface PublishBarProps {
    isReady: boolean;
    canSubmit: boolean;
    isPosting: boolean;
    error: string | null;
    onPublish: () => void;
    groupId: boolean;
}

export default function PublishBar({
    isReady,
    canSubmit,
    isPosting,
    error,
    onPublish,
    groupId,
}: PublishBarProps) {
    return (
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
                <p className="text-sm opacity-70">
                    {isReady
                        ? "Tudo pronto para publicar."
                        : "Para postar, informe um título e adicione ao menos um tópico."}
                </p>

                <p className="text-sm opacity-70">
                        {groupId && "Esta postagem pertencerá a um grupo."}
                </p>

                {error && (
                    <p role="alert" className="text-sm text-red-600 mt-2">
                        {error}
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={onPublish}
                disabled={!canSubmit}
                className={`${glassButton} ${cornerShape} font-huninn text-lg px-10 py-3`}
            >
                {isPosting ? "Publicando..." : "Postar"}
            </button>
        </div>
    );
}