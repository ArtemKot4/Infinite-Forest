abstract class Learning {
    public static list: Record<string, LearningBase> = {};

    public static registry<T extends LearningBase>(learning: T) {
        // const hasLearning = Learning.list[learning.name];

        // if(hasLearning) {
        //     Network.getClientForPlayer(Player.getLocal()).disconnect();
        //     throw new java.lang.IllegalAccessError("Learning already exists. I guess, you cheater, server gets message about it");
        // };

        Learning.list[learning.name] = learning;
    };

    public static get(name: string): Nullable<LearningBase> {
        return Learning.list[name] || null;
    };

};

class Reflection {
    public name: string;
    public page: string;
    public section: string; 
    public max_attempts: number;

    public constructor(name: string, page: string, section: string, max_attempts: number) {
        this.name = name;
        this.page = page;
        this.section = section || "default";
        this.max_attempts = max_attempts || 5;
    }
};