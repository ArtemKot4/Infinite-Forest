class ItemLearning extends LearningBase {
    public type: string = "item";
};

Learning.registry(new ItemLearning("first_lucks", "mill_is_work", "default", "wheat_flour"));

Translation.addTranslation("learning.infinite_forest.first_lucks", {
    en: "First luck",
    ru: "Первые успехи"
})

Learning.registry(new ItemLearning("strange_dream", "main"));
