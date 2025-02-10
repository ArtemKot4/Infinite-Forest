abstract class Learning {
    public static list: Record<string, LearningBase> = {};

    public static get(name: string): Nullable<LearningBase> {
        return Learning.list[name] || null;
    };

};