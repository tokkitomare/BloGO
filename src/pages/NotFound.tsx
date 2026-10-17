export default function NotFound() {
    return (
        <div className="flex justify-center items-center h-full select-none">
            <title>Página não encontrada</title>
            <div className="bg-gradient-light p-5 mix-blend-lighten text-black rounded-tl-2xl rounded-br-2xl shadow-glow-5">
                <h1 className="font-bold text-9xl text-center">404</h1>
                <p className="text-center">Página não encontrada</p>
            </div>
        </div>
    );
}