

abstract class LearningBase<T extends (...args: any[]) => boolean> {
    constructor(protected name: string) {}

    public condition?: T;

    public complete: (player: number) => any;

    public setCondition(condition: T): this {
        this.condition = condition;
        return this;
    };

    public getName(): string {
        return this.name;
    };

    public onComplete(callback: (player: number) => any) {
        this.complete = callback;
    };

    abstract getType(): string;

};
