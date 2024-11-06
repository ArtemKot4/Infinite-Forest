abstract class IdeaAnimation {
  protected constructor() {}

  protected static readonly FRAME_MAX: int = 10;
  protected static readonly IMAGE_SCALE: int = 22.5;
  protected static readonly HEIGHT_LOCATION: int = 23.5;
  protected static readonly WIDTH_LOCATION: int = 310;

  protected static GUI: UI.Window = new UI.Window({
    drawing: [
      { type: "background", color: android.graphics.Color.argb(0, 0, 0, 0) },
    ],
    elements: {
      image: {
        type: "image",
        x: this.WIDTH_LOCATION,
        y: this.HEIGHT_LOCATION,
        bitmap: "idea_book.book_open_0",
        scale: this.IMAGE_SCALE,
      },
    },
  });

  protected static redrawImage(frame: int, scale: int, x?: int, y?: int): void {
    IdeaAnimation.GUI.content.elements["image"] = {
      type: "image",
      x: x || this.WIDTH_LOCATION,
      y: y || this.HEIGHT_LOCATION,
      bitmap: "idea_book.book_open_" + frame,
      scale: scale,
    };
    IdeaAnimation.GUI.forceRefresh();
    return;
  }

  protected static setOffset(x: int, y: int): void {
    IdeaAnimation.GUI.content.elements["image"].x = x;
    IdeaAnimation.GUI.content.elements["image"].y = y;
    IdeaAnimation.GUI.forceRefresh();
    return;
  }

  protected static drawSign(sign: string): void {
    IdeaAnimation.GUI.content.elements["sign"] = {
      type: "image",
      bitmap: "sign." + sign,
      x: this.WIDTH_LOCATION + 25,
      y: this.HEIGHT_LOCATION + 110,
      scale: 9.7,
    };
    IdeaAnimation.GUI.forceRefresh();
  }

  protected static clearSign(): void {
    IdeaAnimation.GUI.content.elements["sign"].bitmap = "unknown";
  }

  protected static close(): void {
    IdeaAnimation.GUI.close();
  }

  protected static open(): void {
    IdeaAnimation.setOffset(this.WIDTH_LOCATION, this.HEIGHT_LOCATION);
    IdeaAnimation.redrawImage(0, this.IMAGE_SCALE);
    IdeaAnimation.GUI.open();
  }

  public static init(sign: Nullable<string | string[]>): void {
    if (sign === null) {
      return;
    };

    if (!ConfigManager.IdeaAnimation) {
      return;
    };

    if (this.GUI.isOpened()) {
      return;
    };
    
    this.open();

    const timerMax: int = [].concat(sign).length - 1;

    let x: int = this.WIDTH_LOCATION;
    let y: int = this.HEIGHT_LOCATION;
    let scale: int = this.IMAGE_SCALE;

    let frame: int = 0;
    let timer: int = 0;
    let alpha: int = 1;
    let signIndex: int = 0;

    Threading.initThread("thread.infinite_forest.idea_animation", () => {

      while (y < 1300) {

        try {

        if (frame < this.FRAME_MAX && timer <= 0) {
          frame++;
          IdeaAnimation.redrawImage(frame, this.IMAGE_SCALE);
          java.lang.Thread.sleep(25);

        } else {

          if (timer > timerMax && frame > 0) {

            this.clearSign();
            IdeaAnimation.redrawImage(frame--, this.IMAGE_SCALE);
            java.lang.Thread.sleep(25);
          }

          if (timer <= timerMax) {

            this.drawSign(Array.isArray(sign) ? sign[signIndex] : sign);

            if (signIndex < sign.length - 1) {
              signIndex++;
            }

            timer++;
            java.lang.Thread.sleep(500);

          } else if (frame <= 0) {

            if (scale < 15) {

              if (x < this.WIDTH_LOCATION * 2.8) {

                IdeaAnimation.redrawImage(0, (scale -= 0.02), (x += 0.98), y);
              } else {

                IdeaAnimation.redrawImage(0, scale, x, (y += 0.87));
                if (y > 250) {

                  IdeaAnimation.GUI.layout.setAlpha((alpha -= 0.007));
                }
              }
            } else {

              IdeaAnimation.redrawImage(0, (scale -= 0.3), x, (y += 0.2));
              java.lang.Thread.sleep(1);
            }

            if (y >= 1300) {

              this.close();
              break;
            };
            
            java.lang.Thread.sleep(1);
          }
        }
      
    } catch (error) {

       Game.message(Translation.translate("message.infinite_forest.idea_animation_broken") + error);
       IdeaAnimation.close();

       break;
    }
  }
    });
  }

  static {
    this.GUI.setAsGameOverlay(true);
    this.GUI.setTouchable(false);
    this.GUI.setBlockingBackground(true);
  };

  public static getGUI(): UI.Window {
    return IdeaAnimation.GUI;
  }
}

Callback.addCallback("ItemUse", (c, i, b, ise, p) => {
  if (i.id === VanillaItemID.charcoal) {
    Book.SignSection.givePage(p, "sign", [
      "question",
      "fire",
      "snow",
      "crystal",
      "forest",
    ]);
  }
});

Translation.addTranslation("message.infinite_forest.idea_animation_broken", {
  en: "Ups... You get error with animation, his has been broken and closed. Please, send issue to https://github.com/Artem0n4/Infinite-Forest\nError: ",
  ru: "Упс... У вас возникла ошибка с анимацией, поэтому она закрылась. Пожалуйста, сообщите нам в виде issue в репозитории https://github.com/Artem0n4/Infinite-Forest\nОшибка: "
})