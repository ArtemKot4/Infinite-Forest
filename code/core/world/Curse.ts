abstract class Curse {
    public static identifiers: Set<string> = new Set();

    abstract getIdentifier(): string;

    constructor() {
        Curse.identifiers.add(this.getIdentifier());
    };

    public hasLocal() {
        Flags.synchronizeCurses();

        return Flags.getCurseListLocal().has(this.getIdentifier());
    };

    public has() {
        return Flags.getCurseList().has(this.getIdentifier());
    };

    public break() {
        this.onBreak();
        return Flags.getCurseList().delete(this.getIdentifier());
    };

    public onBreak?(): void;
};

const ColdCurse = new (class extends Curse {
    getIdentifier(): string {
        return "cold";
    }
})()