class LearningTableTile extends TileEntityBase {
    public UI: UI.Window = (() => {
        const window = new UI.Window(AncientNote.UI.getContent());
        window.setCloseOnBackPressed(true);
        return window;
    })();

    public defaultValues = {
        is_valid: false,
        extra: null as Nullable<ItemExtraData>
    };

    public data: typeof this.defaultValues;

    public dropNote(extra?: Nullable<ItemExtraData>): void {
        if(this.data.extra != null) {
            this.blockSource.spawnDroppedItem(
                this.x + 0.5, 
                this.y + 1.2,
                this.z + 0.5,
                ItemList.ANCIENT_NOTE.id,
                1,
                0,
                this.data.extra
            );
        };
        this.data.extra = extra || null;
        this.data.is_valid = !!extra;
        return;
    };

    public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): void {
        const entity = new PlayerEntity(player);
        const carriedItem = entity.getCarriedItem();

        if(carriedItem.id === ItemList.ANCIENT_NOTE.id) {
            if(carriedItem.extra) {
                const text = carriedItem.extra.getString("text");
                if(Object.keys(AncientNote.list).includes(text)) return;
                
                this.dropNote(carriedItem.extra);
                entity.decreaseCarriedItem(1);
            };
            return; 
        };

        if(Entity.getSneaking(player)) {
            this.dropNote();
            return;
        };

        if(this.data.is_valid) {
            this.drawMain(player);
            this.drawLearningInfo(player);
            this.UI.open();
        };

    };

    public drawMain(player: number): void {
        let text = Translation.translate("message.infinite_forest.typing");
        
        if(this.data.extra != null) {
            text = this.data.extra.getString("text");
        };

        this.UI.content.elements.text.text = UIHelper.separateText(text);

        if(this.UI.content.elements.info_field) {
            this.UI.content.elements.info_field.text = "";
        };

        if(this.UI.content.elements.info_text) {
            this.UI.content.elements.info_text.text = "";
        };

        this.edit(player);
        this.update();
        return;
    };

    public update(): void {
        this.UI.forceRefresh();
        return;
    };

    public edit(player: number): void {
        this.UI.content.elements.button.clicker.onClick = () => {
            const keyboard = new Keyboard(Translation.translate("message.infinite_forest.typing_placeholder"));

            keyboard.getText((text: string) => {
                this.UI.content.elements.text.text = UIHelper.separateText(text || "...");
                this.data.extra ??= new ItemExtraData();
                this.data.extra.putString("text", text);
                this.update();
            });

            keyboard.open();

            const split = this.UI.content.elements.text.text.split("\n") as string[];
            const last_string = split[split.length - 1];

            if(last_string.includes(Translation.translate("message.infinite_forest.transfer_learning"))) {
                const learning = last_string.split(" ").pop();
                const playerHasLearning = ObjectPlayer.getOrCreate(player).learningList[learning];
                
                if(playerHasLearning) {
                    this.data.extra ??= new ItemExtraData();
                    this.data.extra.putString("learning", learning);
                };
            };
        };
    };

    public drawLearningInfo(player: number): void {
        let isPressed: boolean = true;

        this.UI.content.elements.info = {
            "type": "image",
            x: UI.getScreenHeight() / 1.3 + (7 * 2.1),
            y: 30 + (167 * 2.1),
            scale: 2.1,
            bitmap: "ancient_note_info",
            bitmap2: "ancient_note_info_pressed"
        };

        this.UI.content.elements.info_field = {
            type: "image",
            x: UI.getScreenHeight() / 1.3,
            y: 167 * 2.1,
            width: 30 * 2.1,
            height: 30 * 2.1,
            bitmap: "unknown",
            clicker: {
                onClick: () => {
                    if(!isPressed) {
                        this.UI.content.elements.info.bitmap = "ancient_note_info_pressed";
                        let text = Translation.translate("message.infinite_forest.none_learnings");
                        let learningList = Object.keys(ObjectPlayer.getOrCreate(player).learningList);
                        Game.message(learningList);
    
                        if(learningList.length > 0) {
                            text = learningList.reduce((pV, cV, cI) => {
                                return cI === learningList.length - 1 ? pV : pV + cV + ", ";
                            }, Translation.translate("message.infinite_forest.player_learning_list"));
                        };
    
                        this.UI.content.elements.button.clicker.onClick = () => this.drawMain(player);
                        this.UI.content.elements.text.text = UIHelper.separateText(text);

                        this.UI.content.elements.info_text = {
                            type: "text",
                            x: UI.getScreenHeight() / 1.17,
                            y: 240,
                            font: {
                                size: 11,
                                color: android.graphics.Color.parseColor("#9E9E9E"),
                            },
                            multiline: true,
                            text: UIHelper.separateText(Translation.translate("message.infinite_forest.hint_with_learning_transfer") + `"${Translation.translate("message.infinite_forest.transfer_learning")}<?>"`)
                        };

                        isPressed = true;
                    } else {
                        this.UI.content.elements.info.bitmap = "ancient_note_info";
                        this.drawMain(player);
                        isPressed = false;
                    };
                    this.update();
                    return;
                }
            }
        };
    };

};

class LearningTable extends BlockForest implements IBlockModel {
    public constructor() {
        super("learning_table", [{
            name: "block.infinite_forest.learning_table",
            texture: [["eucalyptus_log_side", 0]],
            inCreative: true
        }]);
    };

    public override getModel(): BlockModel | BlockModel[] {
        return new BlockModel("learning_table");
    };

    public override getSoundType(): Block.Sound {
        return "wood";
    };

    public override getTileEntity(): TileEntityBase {
        return new LearningTableTile();
    };
};

Translation.addTranslation("block.infinite_forest.learning_table", {
    en: "Learning table",
    ru: "Исследовательский стол"
});

Translation.addTranslation("message.infinite_forest.player_learning_list", {
    en: "Your learnings: ",
    ru: "Ваши изучения: "
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
    en: "I am tell about ",
    ru: "Рассказываю о "
});

Translation.addTranslation("message.infinite_forest.hint_with_learning_transfer", {
    en: "To transfer learning, you need to type in end: ",
    ru: "Чтобы перенести изучение, вам нужно написать в конце: "
})