

abstract class LearningBase<T extends (...args: any[]) => boolean> {
    constructor(protected name: string) {}

    public dependenceList: string[];

    public condition?: T;

    public completeEvent: (player: number) => any;

    public setCondition(condition: T): this {
        this.condition = condition;
        return this;
    };

    public getName(): string {
        return this.name;
    };

    public setCompleteEvent(callback: (player: number) => any) {
        this.completeEvent = callback;
    };

    public setDependences(...learnings: (string | LearningBase<any>)[]) {
        this.dependenceList = [];
        this.dependenceList.push(...learnings.map((v) => v instanceof LearningBase ? v.getName() : v));
    };

    abstract getType(): string;

    public complete(player: number, ...args: Parameters<T>) {
        const list = Flags.getFor(player).learningList;

        if(list.has(this.getName())) {
            return;
        };
        
        if(Array.isArray(this.dependenceList) && this.dependenceList.length > 0) {
            for(const dependence of this.dependenceList) {
                if(!list.has(dependence)) {
                    return;
                };
            };
        };

        if(!this.condition(...args)) {
            return;
        };

        list.add(this.getName());
    };

};
