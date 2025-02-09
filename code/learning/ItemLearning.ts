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

Learning.registry(new ItemLearning("first_lucks", {
    page: "mill_is_work", icon: "wheat_flour"
}));

Translation.addTranslation("learning.infinite_forest.first_lucks", {
    en: "First luck",
    ru: "Первые успехи"
})

Learning.registry(new ItemLearning("strange_dream", {
    page: "main"
}));
