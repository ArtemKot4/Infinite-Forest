class ItemLearning extends LearningBase {
    public type: string = "item";
    public constructor(name: string, data: {
        page: string, 
        section?: string,
        icon?: string,
    }) {
        super(name, Object.assign(data, { icon_type: 'item' as any }));
    };
};

