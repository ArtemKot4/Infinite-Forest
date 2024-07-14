class LostPaper {
  public static UI: UI.Window = new UI.Window({
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
        text: ERROR_WARNING,
      },
      closeButton: {
        type: "button",
        scale: 1000,
        bitmap: "unknown",
        clicker: {
          onClick() {
            const player = Player.getLocal();
            LostPaper.sendLearning(Entity.getCarriedItem(player), player);
            LostPaper.UI.close();
          },
        },
      },
    },
  });
  protected static textList: { [key: string]: { learning: name; page: name } } =
    {};
  public item: FItem;
  constructor(id: string) {
    this.item = new FItem(id, 1);
    this.item.onUseAndNoTarget(this.open.bind(this));
  }
  public static get getTextList(): {} {
    return LostPaper.textList;
  }
  public static addText(text: string, learning?: string, page?: string): void {
    LostPaper.textList[`note.infinite_forest.${text}`] = { learning, page };
  }
  public static getRandomText(): string {
    return MathHelper.randomValueFromArray(Object.keys(LostPaper.textList));
  }
  public static rewriteText(text: string, player: int) {
    const playerMode = new PlayerActor(player).getGameMode();
    if (playerMode === EGameMode.CREATIVE) {
      text = BookPage.separateText(
        Translation.translate("note.infinite_forest.wrong_mode")
      );
    } else {
      text = BookPage.separateText(Translation.translate(text));
    }
    LostPaper.UI.content.elements["text"].text = text;
    LostPaper.UI.forceRefresh();
  }
  public static generateExtraText(
    item: ItemInstance,
    player: int
  ): ItemExtraData {
    const extra = new ItemExtraData();
    extra.putString("text", LostPaper.getRandomText());
    Entity.setCarriedItem(player, item.id, item.count, item.data, extra);
    return extra;
  }
  public static giveExtraText(item: ItemInstance, player: int) {
    if (item.extra && item.extra.getString("text") !== null) return;
    return (item.extra = LostPaper.generateExtraText(item, player));
  }
  public static getExtraTextByItem(item: ItemInstance): string {
    return item.extra && item.extra.getString("text");
  }
  public static sendLearning(item: ItemInstance, player: int) {
    const text = LostPaper.getExtraTextByItem(item);
    const list = LostPaper.textList?.[text];
    if (list?.learning) {
      Learning.send(list.learning, player, Native.Color.GOLD, list?.page);
    }
  }
  public open(item: ItemInstance, player: int) {
    LostPaper.giveExtraText(item, player);
    LostPaper.rewriteText(LostPaper.getExtraTextByItem(item), player);
    LostPaper.UI.open();
  }
}

const LOST_PAPER = new LostPaper("lost_paper");
LostPaper.addText("forest");
LostPaper.addText("ruine", "ruine");
LostPaper.addText("fireflies");

Translation.addTranslation("note.infinite_forest.wrong_mode", {
  ru: "Извините, но вы не можете читать записки, играя в креативе. Пожалуйста, играйте честно, в режиме выживания или приключения.",
  en: "Sorry, but for read it you must use a survival or adventure mode, creative is not valid.",
});

Translation.addTranslation("lost_paper", {
  ru: "Потрёпанный листок",
  en: "Lost paper",
});

Translation.addTranslation("note.infinite_forest.forest", {
  ru: "Лес, что простирается во все стороны, кажется, бесконечно, окружает нас всю нашу жизнь. В очередной раз прогуливаясь по лесу, я нашёл необычное место. Оно будто бы замёрзло. На нём было растение, что олицетворяло холод, что цвело часто над луной. Я назвал его луноцветом. Но сорвать так и не смог. Любая поверхность, что его касается, моментально замерзает. Я буду работать, чтобы найти способ, как его сорвать. Надеюсь, что удача улыбнётся мне.",
  en: "Sorry, but for read it you must use a survival or adventure mode, creative is not valid.",
});

Translation.addTranslation("note.infinite_forest.fireflies", {
  ru: "Светлячки, это хранители нашего леса. Одни из немногочисленных существ, что приносят в это место хоть капельку света. А ещё их очень много, и они очень быстрые. Возможно, если поставить банку, открыть и ждать, один случайно и залетит на своей скорости, едва ли не разбив банку.",
  en: "Sorry, but for read it you must use a survival or adventure mode, creative is not valid.",
});
