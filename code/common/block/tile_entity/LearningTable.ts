class LearningTableTile extends TileEntityBase {
    public UI: UI.Window = (() => {
        const window = new UI.Window(AncientNote.UI.getContent());
        window.setCloseOnBackPressed(true);
        return window;
    })();

    public defaultValues = {
        is_valid: false,
        text: null,
        learning: null
    };

    public data: typeof this.defaultValues;
    public info_pressed: boolean = false;

    public dropNote(extra?: Nullable<ItemExtraData>): void {
        if(this.data.text != null) {
            const newExtra = new ItemExtraData();
            newExtra.putString("text", this.data.text);
            newExtra.putString("learning", this.data.learning);
            this.blockSource.spawnDroppedItem(
                this.x + 0.5, 
                this.y + 1.2,
                this.z + 0.5,
                ItemList.ANCIENT_NOTE.id,
                1,
                0,
                newExtra
            );
        };
        let text = null;
        let learning = null;

        if(extra) {
            text = extra.getString("text");
            learning = extra.getString("learning");
        };
        
        this.data.text = text;
        this.data.learning = learning;
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
            this.UI.open();
        };

    };

    public drawMain(player: number): void {
        let text = Translation.translate("message.infinite_forest.typing");
        
        if(this.data.text != null) {
            text = this.data.text;
        };

        this.UI.content.elements.text.text = UIHelper.separateText(text);

        if("info_field" in this.UI.content.elements) {
            this.UI.content.elements.info_field.text = "";
        };

        if("info_text" in this.UI.content.elements) {
            this.UI.content.elements.info_text.text = "";
        };

        if("info_icon" in this.UI.content.elements) {
            this.UI.content.elements.info_icon.bitmap = "unknown";
        };

        this.drawLearningInfo(player);
        this.drawEditButton(player);
        this.update();
        return;
    };

    public update(): void {
        this.UI.forceRefresh();
        return;
    };

    public drawEditButton(player: number): void {
        this.UI.content.elements.button.clicker.onClick = () => {
            const keyboard = new Keyboard(Translation.translate("message.infinite_forest.typing_placeholder"));

            keyboard.getText((text: string) => {
                const separatedText = UIHelper.separateText(text || "...");

                this.UI.content.elements.text.text = separatedText;
                this.data.text = text;

                const split = separatedText.split("\n") as string[];
                const need_strings = split[split.length - 2] + split[split.length - 1];
    
                if(need_strings.toLowerCase().includes(Translation.translate("message.infinite_forest.transfer_learning"))) {
                    const learning = need_strings.split(" ").pop();
                    const playerLearnings = ObjectPlayer.getOrCreate(player).learningList;
                    
                    if(learning in playerLearnings) {
                        this.data.learning = learning;
                    };
                };
                this.update();
            });

            keyboard.open();


        };
    };

    public drawLearningInfo(player: number): void {
        this.UI.content.elements.info_image = {
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
                    if(!this.info_pressed) {
                        this.UI.content.elements.info_image.bitmap = "ancient_note_info_pressed";
                        let text = Translation.translate("message.infinite_forest.none_learnings");
                        let learningList = Object.keys(ObjectPlayer.get(player).learningList);
  
                        if(learningList && learningList.length > 0) {
                            text = Translation.translate("message.infinite_forest.player_learning_list");

                            for(const i in learningList) {
                                const current = learningList[i];

                                if(Number(i) === learningList.length - 1) {
                                    text += `"${current}"`;
                                    continue;
                                };
                                text += `"${current}", `;
                            };

                        };
    
                        this.UI.content.elements.button.clicker.onClick = () => this.drawMain(player);
                        this.UI.content.elements.text.text = UIHelper.separateText(text);

                        this.UI.content.elements.info_text = {
                            type: "text",
                            x: UI.getScreenHeight() / 1.17,
                            y: 30 + (138 * 2.1),
                            font: {
                                size: 10.5,
                                color: android.graphics.Color.parseColor("#9E9E9E"),
                            },
                            multiline: true,
                            text: UIHelper.separateText(Translation.translate("message.infinite_forest.hint_with_learning_transfer") + "\n" + `"${Translation.translate("message.infinite_forest.transfer_learning")}<?>"`, 30)
                        };

                        this.UI.content.elements.info_icon = {
                            type: "image",
                            x: (UI.getScreenHeight() / 1.3) + (61 * 2.1),
                            y: 30 + (125 * 2.1),
                            scale: 2.1,
                            bitmap: "info_icon"
                        };

                        this.info_pressed = true;
                    } else {
                        this.UI.content.elements.info_image.bitmap = "ancient_note_info";
                        this.drawMain(player);
                        this.info_pressed = false;
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