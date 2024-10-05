abstract class IdeaUI {
  protected constructor() {}

  public static readonly FRAME_MAX = 10;
  public static readonly IMAGE_SCALE = 22.5;
  public static readonly HEIGHT_LOCATION = 23.5;
  public static readonly WIDTH_LOCATION = 310;

  public static GUI = new UI.Window({

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

  public static redrawImage(frame: int, scale: int, x?: int, y?: int) {
    IdeaUI.GUI.content.elements["image"] = {
      type: "image",
      x: x || this.WIDTH_LOCATION,
      y: y || this.HEIGHT_LOCATION,
      bitmap: "idea_book.book_open_" + frame,
      scale: scale,
    };
    IdeaUI.GUI.forceRefresh();
    return;
  }

  public static setOffset(x: int, y: int) {
    IdeaUI.GUI.content.elements["image"].x = x;
    IdeaUI.GUI.content.elements["image"].y = y;
    IdeaUI.GUI.forceRefresh();
    return;
  }

  public static drawRune(rune: string) {
    IdeaUI.GUI.content.elements["rune"] = {
      type: "image",
      bitmap: "rune." + rune,
      x: this.WIDTH_LOCATION + 25,
      y: this.HEIGHT_LOCATION + 110,
      scale: 9.7,
    };
    IdeaUI.GUI.forceRefresh();
  }

  public static clearRune() {
    IdeaUI.GUI.content.elements["rune"].bitmap = "unknown";
  }

  public static close() {
    IdeaUI.GUI.close();
  }

  public static open() {
    IdeaUI.setOffset(this.WIDTH_LOCATION, this.HEIGHT_LOCATION);
    IdeaUI.redrawImage(0, this.IMAGE_SCALE);

    IdeaUI.GUI.open();
  }

  public static initAnimation(rune: string | string[]) {
    if (this.GUI.isOpened()) {
      return;
    }
    this.open();

    let x = this.WIDTH_LOCATION;
    let y = this.HEIGHT_LOCATION;
    let frame = 0;
    let timer = 0;
    let scale = this.IMAGE_SCALE;

    let timerMax = [].concat(rune).length;

    let runeIndex = 0;

    Threading.initThread("thread.infinite_forest.idea_animation", () => {
      while (y < 1300) {

        if (frame < this.FRAME_MAX && timer <= 0) {
          frame++;

          IdeaUI.redrawImage(frame, this.IMAGE_SCALE);
          java.lang.Thread.sleep(50);
          
        } else {

          if (timer > timerMax && frame > 0) {

            this.clearRune();
            IdeaUI.redrawImage(frame--, this.IMAGE_SCALE);

            java.lang.Thread.sleep(50);
          };

          if (timer <= timerMax) {
            this.drawRune(
              Array.isArray(rune)
                ? rune[runeIndex]
                : rune
            );

          if(runeIndex < rune.length - 1) {
            runeIndex++;
          }

            timer++;
            java.lang.Thread.sleep(1000);

          } else if (frame <= 0) {

            if (scale < 10) {

              if (x < this.WIDTH_LOCATION * 3) {

                IdeaUI.redrawImage(0, (scale -= 0.04), (x += 1), (y += 0.3));
              } else {

                IdeaUI.redrawImage(0, (scale -= 0.03), x, (y += 0.7));
              }

            } else {

              IdeaUI.redrawImage(0, (scale -= 0.3), x, (y += 0.2));
              java.lang.Thread.sleep(2);
            }

            if (y >= 1300) {

              this.close();
              break;
            }
            java.lang.Thread.sleep(1);
          }
        }
      }
    });
  }

  static {
    this.GUI.setAsGameOverlay(true);
    this.GUI.setTouchable(false);
  }
}

abstract class BookUI {
  public static pagesList: Record<playerName, string[]> = {};
  protected constructor() {}
  protected static content = {
    drawing: [
      {
        type: "background",
        color: android.graphics.Color.argb(38, 22, 22, 22),
      },
      {
        type: "bitmap",
        bitmap: "book.learning_book_background",
        x: UI.getScreenHeight() / 3,
        y: 30,
        scale: 2,
      },
    ],
    elements: {
      closeButton: {
        type: "closeButton",
        x: UI.getScreenHeight() - 274,
        y: 90,
        scale: 1.9,
        bitmap: "close_button",
      },
      buttonRight: {
        type: "button",
        x: UI.getScreenHeight() * 1.5,
        y: 372.5,
        scale: 3,
        bitmap: "book.right_button",
        bitmap2: "book.right_button_pressed",
        clicker: {
          onClick: BookUI.rightOnClick,
        },
      },
      buttonLeft: {
        type: "button",
        x: UI.getScreenHeight() / 1.75,
        y: 372.5,
        scale: 3,
        bitmap: "book.left_button",
        bitmap2: "book.left_button_pressed",
        clicker: {
          onClick: BookUI.leftOnClick,
        },
      },

      number1: {
        type: "text",
        x: UI.getScreenHeight() / 1.35,
        y: 375,
        font: {
          size: 15,
          color: android.graphics.Color.parseColor("#B8AC8F"),
        },
        text: ERROR_WARNING,
      },
      number2: {
        type: "text",
        x: UI.getScreenHeight() * 1.35,
        y: 375,
        font: {
          size: 15,
          color: android.graphics.Color.parseColor("#B8AC8F"),
        },
        text: ERROR_WARNING,
      },
    },
  } as UI.WindowContent;
  protected static drawPageNumbers() {
    const name = Entity.getNameTag(Player.getLocal());
    const content = BookUI.UI.getContent();
    const index = BookUI.findPageIndex();
    content.elements["number1"].text = index.toString();
    content.elements["number2"].text = (index + 1).toString();
  }

  protected static findPageIndex() {
    const playerName = Entity.getNameTag(Player.getLocal());
    const findPageIndex = BookUI.pagesList[playerName].findIndex((v) =>
      (BookUI.UI.content.elements["leftTitle"].text as string).includes(
        Translation.translate(v)
      )
    );
    return findPageIndex;
  }

  protected static buttonFlip(index: int) {
    const name = Entity.getNameTag(Player.getLocal());
    if (BookUI.pagesList[name][index] !== undefined) {
      const content = BookPage.resultPages[BookUI.pagesList?.[name][index]];
      return BookUI.setContent(content);
    }
  }
  protected static rightOnClick(
    position: Vector,
    container: com.zhekasmirnov.innercore.api.mod.ui.container.UiAbstractContainer
  ) {
    return BookUI.buttonFlip(BookUI.findPageIndex() + 1);
  }
  protected static leftOnClick(
    position: Vector,
    container: com.zhekasmirnov.innercore.api.mod.ui.container.UiAbstractContainer
  ) {
    return BookUI.buttonFlip(BookUI.findPageIndex() - 1);
  }
  public static UI = new UI.Window(BookUI.content as UI.WindowContent);
  public static setContent(content: {
    elements: UI.ElementSet;
    drawing: UI.DrawingSet;
  }) {
    const concatedElements = Object.assign(
      {},
      BookUI.content.elements,
      content.elements
    );
    const concatedDrawings = []
      .concat(BookUI.content.drawing)
      .concat(content.drawing.concat());
    BookUI.UI.setContent(
      Object.assign(
        {},
        { elements: concatedElements, drawing: concatedDrawings }
      ) as UI.WindowContent
    );
    BookUI.drawPageNumbers();
    BookUI.UI.forceRefresh();
  }
  public static getPagesFor(playerName: string): name[] {
    const list = BookUI.pagesList[playerName];
    if (!list) {
      return (BookUI.pagesList[playerName] = ["main_title"]);
    }
    return list;
  }
  public static openFor(player: int) {
    const playerName = Entity.getNameTag(player);
    const content = BookPage.resultPages[BookUI.getPagesFor(playerName)[0]];
    BookUI.setContent(content);
    BookUI.UI.open();
  }
  public static givePage(player: int, page: name, rune: string | string[]) {
    IdeaUI.initAnimation(rune);
    (BookUI.pagesList[Entity.getNameTag(player)] ??= ["main_title"]).push(page);
  }
  static {
    BookUI.UI.setCloseOnBackPressed(true);
    BookUI.UI.setBlockingBackground(true);
  }
}

Item.registerUseFunctionForID(VanillaItemID.coal, () => {
  IdeaUI.initAnimation("crystal");
});

/*
 
  Threading.initThread("thread.infinite_forest.idea_animation", () => {
      while (y < 1300) {
          if (frame < this.FRAME_MAX && timer <= 0) {
            frame++;
              IdeaUI.redrawImage(frame, this.IMAGE_SCALE);
              java.lang.Thread.sleep(50);
          }
          else {
            if(timer > 5 && frame > 0) {
              this.clearRune();
              IdeaUI.redrawImage(frame--, this.IMAGE_SCALE);
              java.lang.Thread.sleep(50);
            }
              if (timer < 5) {
                this.drawRune(Array.isArray(rune) ? MathHelper.randomValueFromArray(rune) : rune);
                  timer++;
                  java.lang.Thread.sleep(1000);
              }
              else if (frame <= 0) {
                  if (scale < 12.5) {
                      if (x < this.WIDTH_LOCATION * 3) {
                          IdeaUI.redrawImage(0, scale -= 0.06, x += 0.8, y += 0.3);
                      }
                      else {
                          IdeaUI.redrawImage(0, scale -= 0.03, x, y += 0.8);
                      }
                  }
                  else {
                      IdeaUI.redrawImage(0, scale -= 0.05, x, y += 0.2);
                      java.lang.Thread.sleep(4);
                  }
                  ;
                 if(y >= 1300) {
                     this.close();
                     break;
                 };
                  java.lang.Thread.sleep(2);
              }
          }
      }
  });

 */
