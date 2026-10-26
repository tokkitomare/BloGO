export default function (
    {onClose, isOpen}: {onClose: () => void, isOpen: boolean}
) {
    return (
        <div
            onClick={onClose}
            aria-hidden="true"
            className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm
                transition-opacity duration-300 motion-reduce:transition-none
                ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        />
    );
}