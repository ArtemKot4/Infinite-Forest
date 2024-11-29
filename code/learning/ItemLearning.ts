class ItemLearning extends LearningBase<LearningType.Item> {
    constructor(name: string, protected item: number, public type?: "click" | "hand") {
        super(name);
    };

    public getItem(): number {
        return this.item;
    };

};
