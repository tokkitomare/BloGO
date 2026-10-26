export default function NoPosts() {
    return (
        <div className="mt-2 p-8 rounded-2xl bg-glass shadow-glow-3 border border-white/30 text-center flex flex-col items-center gap-2">
            <h2 className="text-xl font-bold">Nenhuma publicação ainda</h2>
            <p className="text-sm opacity-70">
                Quando alguém publicar, os posts aparecem aqui.
            </p>
        </div>
    );
}