export function getImages() {
    return Object.values(
        import.meta.glob("../../../../assets/images/*.jp*", {
            eager: true,
            query: "?url",
            import: "default",
        })
    ) as string[];
}