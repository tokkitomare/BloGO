import { signOut, type User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebaseConfig";

export async function logOutHandler(
    onClose: () => void,
    user: User | null,
) {
        const navigate = useNavigate();
        
        onClose();

        if (!user) { navigate("/login"); return; }

        try {
            await signOut(auth);

            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Erro ao sair da conta:", error);
            alert("Não foi possível sair da conta. Tente novamente.");
        }
    }