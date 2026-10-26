import { Link, useNavigate } from "react-router-dom";
import type { Group } from "../../../../types";

interface GroupAboutHeaderProps {
    group: Group,
    memberCount: number
    sendTo: string,
    canViewJoinButton: boolean,
    isMember: boolean,
    handleJoinOrLeave: () => Promise<void>;
}

export default function GroupAboutHeader({
    group, memberCount,
    sendTo, canViewJoinButton,
    isMember, handleJoinOrLeave
}: GroupAboutHeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="bg-gradient-dark rounded-3xl overflow-hidden text-white">
            <div className="h-24 sm:h-36 bg-glass" />

            <div className="px-4 sm:px-8 pb-5 flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5">
                <div
                    className="-mt-10 sm:-mt-14 shrink-0 size-20 sm:size-28 rounded-full bg-glass shadow-glow-2 overflow-hidden
                                    ring-4 ring-white/20"
                >
                    <img
                        src={group.photo}
                        alt={`Foto do grupo ${group.name}`}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <h1 className="font-huninn text-2xl sm:text-3xl truncate">
                        <Link to={sendTo}>{group.name}</Link>
                    </h1>
                    <p className="text-sm text-white/65">
                        {memberCount} {memberCount === 1 ? "membro" : "membros"}
                    </p>
                </div>

                <div className="flex gap-2 shrink-0">
                    <button
                        type="button"
                        className="rounded-full px-5 py-2 text-sm font-medium bg-glass shadow-glow-2 cursor-pointer
                                        hover:bg-white/10 transition-colors duration-200 motion-reduce:transition-none
                                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        onClick={() => navigate(sendTo)}
                    >
                        Ver grupo
                    </button>
                    {canViewJoinButton && (
                        <button
                            type="button"
                            className={`rounded-full px-5 py-2 text-sm font-medium cursor-pointer
                transition-colors duration-200 motion-reduce:transition-none
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
                ${isMember ? "ring-1 ring-white/50 hover:bg-white/10" : "bg-glass shadow-glow-2 hover:bg-white/10"}`}
                            onClick={handleJoinOrLeave}
                        >
                            {isMember ? "Sair do grupo" : "Entrar"}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}