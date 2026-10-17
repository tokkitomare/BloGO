
function loadFromStorage<T>(key: string): T[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export default function GroupManage() {
    return (
        <main className="main-class">
            <title>Gerenciar Grupo - BloGO</title>
        </main>
    );
}