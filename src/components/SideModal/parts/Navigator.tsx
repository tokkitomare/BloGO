import { NavLink, useLocation } from "react-router-dom";
import {
    User as UserIcon,
    Pencil,
    Users,
    ChevronDown,
    LogOut,
    LogIn,
    Settings,
    type LucideIcon,
} from "lucide-react";
import type { User } from "firebase/auth";
import { logOutHandler } from "../handlers/logOutHandler";
import { itemClass } from "./styles";

interface Props {
    userId: string;
    onClose: () => void;
    setGroupsOpen: () => void;
    groupsOpen: boolean;
    user: User | null;
}

const GROUPS_LINKS = [
    { label: "Procurar grupos", to: "/groups/search" },
    { label: "Criar grupo", to: "/groups/create" },
    { label: "Gerenciar grupo", to: "/groups/manage" },
];

interface MainLinkProps {
    to: string;
    label: string;
    icon: LucideIcon;
    active: boolean;
    onClick: () => void;
}

function MainLink({ to, label, icon: Icon, active, onClick }: MainLinkProps) {
    return (
        <li>
            <NavLink to={to} onClick={onClick} className={itemClass(active)}>
                <Icon strokeWidth={1.5} />
                <span className="flex-1 text-left">{label}</span>
            </NavLink>
        </li>
    );
}

interface GroupsMenuProps {
    open: boolean;
    active: boolean;
    onToggle: () => void;
    onClose: () => void;
}

function GroupsMenu({ open, active, onToggle, onClose }: GroupsMenuProps) {
    return (
        <li>
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                aria-controls="groups-submenu"
                className={`${itemClass(active)} cursor-pointer`}
            >
                <Users strokeWidth={1.5} />
                <span className="flex-1 text-left">Grupos</span>
                <ChevronDown
                    size={16}
                    className={`transition-transform ${open ? "rotate-180" : "rotate-0"}`}
                />
            </button>

            <div
                id="groups-submenu"
                className={`grid transition-[grid-template-rows,visibility] duration-200 ease-out motion-reduce:transition-none ${
                    open ? "grid-rows-[1fr] visible" : "grid-rows-[0fr] invisible"
                }`}
            >
                <ul className="overflow-hidden flex flex-col gap-1 pl-6">
                    {GROUPS_LINKS.map(({ label, to }) => (
                        <li key={to} className="first:mt-2">
                            <NavLink
                                to={to}
                                onClick={onClose}
                                className={({ isActive }) => itemClass(isActive, "sub")}
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </li>
    );
}

export default function SideMenu({
    userId,
    onClose,
    setGroupsOpen,
    groupsOpen,
    user,
}: Props) {
    const { pathname } = useLocation();
    const isActive = (prefix: string) => pathname.startsWith(prefix);

    const mainLinks = [
        { to: `/profile/${userId}`, label: "Perfil", icon: UserIcon, active: isActive("/profile") },
        { to: "/post", label: "Postar", icon: Pencil, active: isActive("/post") },
    ];

    const AuthIcon = user ? LogOut : LogIn;

    return (
        <nav aria-label="Menu lateral">
            <ul className="flex flex-col gap-2">
                {mainLinks.map((link) => (
                    <MainLink key={link.to} {...link} onClick={onClose} />
                ))}

                <GroupsMenu
                    open={groupsOpen}
                    active={isActive("/groups")}
                    onToggle={setGroupsOpen}
                    onClose={onClose}
                />

                <MainLink
                    to="/configuration"
                    label="Configurações"
                    icon={Settings}
                    active={isActive("/configuration")}
                    onClick={onClose}
                />

                <li>
                    <button
                        type="button"
                        onClick={() => void logOutHandler(onClose, user)}
                        className={`${itemClass(false)} cursor-pointer`}
                    >
                        <AuthIcon strokeWidth={1.5} />
                        <span className="flex-1 text-left">{user ? "Sair" : "Entrar"}</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}