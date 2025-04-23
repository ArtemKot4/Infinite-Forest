class AncientNote extends BasicItem implements INoTargetUseCallback, IItemUseCallback, INameOverrideCallback {
    /**
     * @key is a the text of the note
     * @value is the learning name
     */
    public static list: Record<string, Nullable<string>> = {};

    /**
     * Function to add new various of ancient note text
     * @param text is the text of the note
     * @param learning is the learning name
     */

    public static add(text: string, learning: string = null) {
        AncientNote.list[text] = learning;
    };

    public static UI: UI.Window = (() => {
        const window = new UI.Window({
            drawing: [
                {
                    type: "background",
                    color: android.graphics.Color.argb(38, 22, 22, 22),
                },
                {
                    type: "bitmap",
                    bitmap: "ancient_note",
                    x: UI.getScreenHeight() / 1.3,
                    y: 30,
                    width: 136 * 2.1,
                    height: 179 * 2.1
                },
            ],
            elements: {
                text: {
                    type: "text",
                    x: UI.getScreenHeight() / 1.17,
                    y: 80,
                    font: {
                        size: 12.5,
                        color: android.graphics.Color.parseColor("#9E9E9E"),
                    },
                    multiline: true,
                    text: null
                },
                button: {
                    type: "image",
                    bitmap: "unknown",
                    width: 136 * 2.1,
                    height: 100 * 2.1,
                    x: UI.getScreenHeight() / 1.3,
                    y: 30,
                    clicker: {}
                }
            }
        });

        window.setCloseOnBackPressed(true);
        window.setBlockingBackground(true);
        return window;
    })();

    public openFor(player: number, text: string) {
        const client = Network.getClientForPlayer(player);
        if(client) {
            client.send("packet.infinite_forest.ancient_note.open_ui", {
                text
            });
        };
    };

    public whichContains(player: number): string[] {
        let list = [];
        let actor = new PlayerActor(player);

        for(let i = 0; i < 36; i++) {
            const current = actor.getInventorySlot(i);
            if(current.id === this.id) {
                const text = current.extra && current.extra.getString("text");
                if(text != null) {
                    list.push(text);
                };
            };
        };
        return list;
    };

    public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        if(block.id === BlockList.LEARNING_TABLE.id) {
            return;
        };

        const list = this.whichContains(player);
        Game.message(list);
        let text = item.extra && item.extra.getString("text");

        if(!text) {
            text = Object.keys(AncientNote.list).find((v) => !list.includes(v)) || Translation.translate("ancient_note.infinite_forest.empty");

            const extra = new ItemExtraData();
            extra.putString("text", text);

            const learning = AncientNote.list[text];

            if(learning) {
                extra.putString("learning", learning);
            };

            Entity.setCarriedItem(player, this.id, 1, 0, extra);
        };

        return this.openFor(player, text);
    };

    public onNoTargetUse(item: ItemStack, player: number): void {
        return this.onItemUse(null, item, new ItemStack(), player);
    };

    public onNameOverride(item: ItemInstance, translation: string, name: string): string {
        let text = "???";
        if(item.extra)  {
            const self_text = item.extra.getString("text");
            const learning = item.extra.getString("learning");

            if(self_text) {
                text = self_text.slice(0, 10) + "...";
            };

            if(learning) {
                text += "\n" + Translation.translate("message.infinite_forest.learning") + (learning || Translation.translate("message.infinite_forest.none"));
            };
        };
        return Translation.translate(name) + "\n" + Native.Color.GRAY + Translation.translate("ancient_note.infinite_forest.contains") + text;
    };

    public setupAllToCreative(): void {
        for(const text in AncientNote.list) {
            const learning = AncientNote.list[text];
            const extra = new ItemExtraData();

            extra.putString("text", text); 

            if(learning) {
                extra.putString("learning", learning);
            };

            Item.addToCreative(this.id, 1, 0, extra);
        };
    };

    public override inCreative(): boolean {
        return true;
    };

    public override getName(): string {
        return "item.infinite_forest.ancient_note";
    };

    public constructor() {
        super("ancient_note", {
            name: "ancient_note",
            meta: 0 
        }, {
            stack: 1
        });
    };
};

Network.addClientPacket("packet.infinite_forest.ancient_note.open_ui", (data: {
    text: string
}) => {
    if(AncientNote.UI.isOpened()) return;

    const content = AncientNote.UI.getContent();
    const isCustomText = !Object.keys(AncientNote.list).includes(data.text);

    content.elements.text.text = UIHelper.separateText(
        isCustomText ? data.text : Translation.translate(`ancient_note.infinite_forest.${data.text}`) 
    );

    content.elements.button.clicker.onClick = () => {
        AncientNote.UI.close();
        Network.sendToServer("packet.infinite_forest.ancient_note.send_learning", data);
        return;
    };

    AncientNote.UI.setContent(content);
    AncientNote.UI.forceRefresh();
    AncientNote.UI.open();
});

Network.addServerPacket("packet.infinite_forest.ancient_note.send_learning", (client, data: {}) => {
    if(!client) return;
    
    const player = client.getPlayerUid();
    const carriedItem = Entity.getCarriedItem(player);

    if(carriedItem.id === ItemList.ANCIENT_NOTE.id) {
        if(!carriedItem.extra) return;

        const learning = carriedItem.extra.getString("learning");

        if(!learning) return;
    
        Learning.giveFor(player, learning);
    };
});

Translation.addTranslation("ancient_note.infinite_forest.empty", {
    en: "This note is empty",
    ru: "Эта записка пуста"
});

Translation.addTranslation("ancient_note.infinite_forest.contains", {
    en: "Record: ",
    ru: "Запись: "
})

AncientNote.add("unity_with_nature");
AncientNote.add("flames");
AncientNote.add("strange_walls");
AncientNote.add("test", "first_lucks"); //todo: debug

Translation.addTranslation("message.infinite_forest.learning", {
    en: "Learning: ",
    ru: "Изучение: "
});

Translation.addTranslation("message.infinite_forest.none", {
    en: "None",
    ru: "Нет"
});

Translation.addTranslation("ancient_note.infinite_forest.strange_walls", {
    ru: "Пока пусто"
}); 

Translation.addTranslation("ancient_note.infinite_forest.flames", {
    en: "I love glowworms. They so beautiful, and, seems, they not afraid of dark. I love them, and, seems, they love me.",
    ru: "Я люблю огоньки. Они так красиво светятся, и, кажется, они не боятся темноты. Я люблю их, и, кажется, они любят меня." 
})

Translation.addTranslation("ancient_note.infinite_forest.unity_with_nature", {
    ru: "Мне нравятся наши места. Здесь теплее, чем в остальном лесу. Люблю посидеть у берега озера, и люблю, когда светлячки пролетают над ним. Очень красиво. И хоть здесь всегда темно, но есть в этом месте что-то такое, необыкновенное, не как в нашей деревне. Здесь я чувствую себя спокойно, только редкий ветер колышит траву, наполняя её присутствием..",
    en: "I love our places. Here so more warm then in other forest. I like sitting in front of beach of lake, and i like, when fireflies will fly up him. Over beautiful. And although here always dark, but it place has something so, does not default, do not as in our village. Here i am felling peaceful myself, only rarely wind touches a grass, will contain his coming."
});

Translation.addTranslation("item.infinite_forest.ancient_note", {
    en: "Ancient note",
    ru: "Древняя записка"
});

