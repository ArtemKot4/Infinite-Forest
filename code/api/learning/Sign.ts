class Sign {
    public static list: { [signName: string]: Sign } = {};
    public static keywords: { [signName: string]: string[] } = {};

    public constructor(public name: string, public icon: string) {
        Sign.keywords[name] = [];
        Sign.list[name] = this;
    }

    public addKeywords(...keywords: string[]): void {
        for(const i in keywords) {
            Sign.keywords[this.name].push(keywords[i]);
        }
    }

    public static get(name: string): Nullable<Sign> {
        return Sign.list[name] || null;
    }

    public static getFrom(itemID: number): string[] {
        const stringID = IDRegistry.getStringIdForItemId(itemID);
        const sings = [];

        for(const i in Sign.keywords) {
            const keywords = Sign.keywords[i];
            if(keywords.some(v => stringID.includes(v))) {
                sings.push(i);
            }
        }
        return sings;
    }
}