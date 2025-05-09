class ItemLearning extends LearningBase {
    public type: string = "item";
    public constructor(name: string, data: {
        pageName: string, 
        section?: string,
        icon?: string,
    }) {
        super(name, Object.assign(data, { iconType: "item" as any }));
    };
};

