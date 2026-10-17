import ImageUploader from "../components/ImageUploader";

export default function A() {
    return (
        <main className="main-class grid grid-cols-5 bg-glass">
            <title>TESTES</title>
            <div className="bg-gradient-light">a</div>
            <div className="bg-gradient-light">a</div>
            <div className="bg-gradient-light">a</div>
            <div className="bg-gradient-light">a</div>
            
            <ImageUploader label="Imagem teste" storageKey="Teste" />
        </main>
    );
}