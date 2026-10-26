export default function ({groupsOpen}: {groupsOpen: boolean}) {
    return (
        <div className="absolute bottom-4 left-0 w-full flex justify-center">
            <div
                className={`absolute bottom-0 left-0 w-full flex justify-center
                transition-transform duration-150 ease-in-out 
                ${groupsOpen ?
                    "scale-50 translate-y-16 h-sm:scale-100 h-sm:translate-y-0" : 
                    "scale-100 translate-y-0"
                }`}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1080 1080"
                    fill="#fff"
                    className="w-1/2"
                >
                    <path d="M356 180h41c32 0 55 22 55 55v216c0 15-10 25-20 37-16 20-6 69 7 97 21 46 67 63 115 63 67 0 117-45 117-111 0-54-26-106-59-130-9-7-10-10-10-24v-41c0-12-6-16 5-13 93 22 157 113 157 208 0 115-90 209-206 209-114 0-205-92-205-207 0-21 2-44 2-70V184c0-3 1-4 1-4z" />
                    <path d="M547 336h16c10 0 16 6 16 16v189c0 10-7 17-17 17h-15c-10 0-17-7-17-17V352c0-10 7-16 17-16z" />

                </svg>
            </div>
        </div>
    );
}