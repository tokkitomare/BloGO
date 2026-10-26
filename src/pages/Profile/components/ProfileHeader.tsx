import type { User } from "../../../types";

interface ProfileHeaderProps {
    user: User
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
    return (
        <header className="relative bg-gradient-dark rounded-3xl p-5 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            <div className="flex flex-col items-center gap-2 shrink-0">
                <div
                    className="group relative size-32 sm:size-44 rounded-full bg-glass shadow-glow-2 overflow-hidden
                                    flex items-center justify-center text-white
                                    ring-4 ring-white/20 ring-offset-4 ring-offset-transparent
                                    focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >

                    {user.photoUrl && (
                        <img
                            key={user.photoUrl}
                            src={user.photoUrl}
                            alt="Foto de perfil"
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                </div>
            </div>

            <dl className="w-full min-w-0 flex flex-col gap-4 sm:gap-6 text-white">
                <div className="bg-glass shadow-glow-2 rounded-tl-2xl rounded-br-2xl px-5 py-3 min-w-0">
                    <dt className="text-sm text-white/65">Nome</dt>
                    <dd className="font-huninn text-2xl sm:text-4xl truncate">{user.displayName}</dd>
                </div>
                <div className="bg-glass shadow-glow-2 rounded-tl-2xl rounded-br-2xl px-5 py-3 min-w-0">
                    <dt className="text-sm text-white/65">E-mail</dt>
                    <dd className="font-huninn text-lg sm:text-3xl truncate">{user.email}</dd>
                </div>
            </dl>
        </header>
    );
}