class AncientNote extends ItemForest {
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
                    bitmap: "lost_paper",
                    x: UI.getScreenHeight() / 1.3,
                    y: 30,
                    scale: 2.1,
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
                closeButton: {
                    type: "button",
                    scale: 1000,
                    bitmap: "unknown",
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
        const list = this.whichContains(player);
        Game.message(list);
        let text = item.extra && item.extra.getString("text");

        if(!text) {
            let unique_records = [];

            for(const name in AncientNote.list) {
                if(!list.includes(name)) {
                    unique_records.push(name);
                };
            };

            text = MathHelper.randomFromArray(unique_records || ["ancient_note.infinite_forest.empty"]);

            let extra = new ItemExtraData();
            extra.putString("text", text);

            Entity.setCarriedItem(player, this.id, 1, 0, extra);
        };

        return this.openFor(player, text);
    };

    public onNoTargetUse(item: ItemStack, player: number): void {
        return this.onItemUse(null, item, null, player);
    };

    public onNameOverride(item: ItemInstance, translation: string, name: string): string {
        let text = (item.extra && item.extra.getString("text")) || "???";
        return Translation.translate(name) + "\n" + Native.Color.GRAY + Translation.translate("ancient_note.infinite_forest.contains") + text;
    };

    public setupAllToCreative() {
        for(const text in AncientNote.list) {
            const extra = new ItemExtraData();
            extra.putString("text", text); 
            Item.addToCreative(this.id, 1, 0, extra);
        };
    };

    public constructor() {
        super("ancient_note", {
            name: "ancient_note",
            meta: 0 
        }, 1);
        this.setupAllToCreative();
    };

    public inCreative(): boolean {
        return true;
    };
};

Network.addClientPacket("packet.infinite_forest.ancient_note.open_ui", (data: {
    text: string
}) => {
    if(AncientNote.UI.isOpened()) return;

    const content = AncientNote.UI.getContent();

    content.elements.text.text = UIHelper.separateText(Translation.translate(`ancient_note.infinite_forest.${data.text}`));

    content.elements.closeButton.clicker.onClick = (position, container) => {
        AncientNote.UI.close();
        Network.sendToServer("packet.infinite_forest.ancient_note.send_learning", data);
        return;
    };

    AncientNote.UI.setContent(content);
    AncientNote.UI.forceRefresh();
    AncientNote.UI.open();
});

Network.addServerPacket("packet.infinite_forest.ancient_note.send_learning", (client, data: {
    text: string
}) => {
    if(!client) return;

    const learning = AncientNote.list[data.text];

    if(!learning) return;
    
    const player = client.getPlayerUid();
    const carriedItem = new PlayerEntity(player).getCarriedItem();

    if(carriedItem.id === ItemList.ANCIENT_NOTE.id) {
        const text = carriedItem.extra && carriedItem.extra.getString("text");

        if(text === null) {
            return;
        };

        if(text === data.text) {
            return ObjectPlayer.addLearning(player,learning);
        };
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

