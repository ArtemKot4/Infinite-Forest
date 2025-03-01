class LearningTable extends BasicBlock implements IBlockModel {
    public constructor() {
        super("learning_table", [{
            name: "block.infinite_forest.learning_table",
            texture: [["eucalyptus_log_side", 0]],
            inCreative: true
        }]);
    };

    public getModel(): BlockModel {
        return new BlockModel(modelsdir, "block/learning_table", "learning_table");
    };

    public override getSoundType(): Block.Sound {
        return "wood";
    };

    public override getTileEntity(): CommonTileEntity {
        return new LearningTableTile();
    };
};

Translation.addTranslation("block.infinite_forest.learning_table", {
    en: "Learning table",
    ru: "Исследовательский стол"
});

Translation.addTranslation("message.infinite_forest.player_learning_list", {
    en: "Available learnings: ",
    ru: "Доступные изучения: "
});

Translation.addTranslation("message.infinite_forest.none_learnings", {
    en: "Learnings is not",
    ru: "Нет изучений"
});

Translation.addTranslation("message.infinite_forest.typing", {
    en: "I guess, here clearly. Time is come to fix it...",
    ru: "Кажется, здесь чисто. Думаю, пришло время это исправить..."
});

Translation.addTranslation("message.infinite_forest.typing_placeholder", {
    en: "Press text",
    ru: "Введите текст"
});

Translation.addTranslation("message.infinite_forest.transfer_learning", {
    en: "i am tell about ",
    ru: "рассказываю о "
});

Translation.addTranslation("message.infinite_forest.hint_with_learning_transfer", {
    en: "To share of learning, tell about his: ",
    ru: "Чтобы поделиться изучением, расскажите о нём: "
});