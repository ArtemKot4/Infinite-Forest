abstract class LearningBase {
    constructor(public name: string, public page: string, public section: string = "default", public icon?: string) {};

    abstract type: string;

    public dependenceList: string[];

    public static condition?(...args: unknown[]): boolean;

    public static completeEvent?(player: number, ...args: Parameters<typeof this.condition>): any;

    public static complete<T extends LearningBase>(learning: T, player: number, ...args: Parameters<typeof this.condition>): void {
        const list = ObjectPlayer.get(player).learningList;

        if (learning.name in list) {
            return;
        }

        if (Array.isArray(learning.dependenceList) && learning.dependenceList.length > 0) {
            for (const dependence of learning.dependenceList) {
                if (!(dependence in list)) {
                    return;
                }
            }
        }

        if (this.condition && !this.condition(...args)) {
            return;
        };

        if(this.completeEvent) {
            this.completeEvent(player, ...args);
        };

        ObjectPlayer.addLearning(player, learning.name);
        return;
    };
};

class EventLearning extends LearningBase {
    public type: string = "event";
};

Learning.registry(new EventLearning("test", "test"));
Learning.registry(new EventLearning("first_point", "infinite_forest_is_real"));
