class Flags {
    private constructor() {};

    public static list: {
        curses: string[];
        players: Record<number, {
            learnings: string[];
            reflections: Record<string, {
                progress: number,
                regress: number
            }>;
            book: {
                pages: string[];
                pages_myself: {
                    title: string,
                    subtitle: string,
                    text: string
                }[];
            }
        }>
    };

    public static 
}