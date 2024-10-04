abstract class IdeaUI {
  protected constructor() {};

  public static readonly FRAME_MAX = 10;
  public static readonly IMAGE_SCALE = 35;
  public static readonly HEIGHT_LOCATION = 250;
  public static readonly WIDTH_LOCATION = 270;

  public static GUI = new UI.Window({
    location: {
      height: 500,
      width: 500,
      x: this.WIDTH_LOCATION,
      y: this.HEIGHT_LOCATION,
    },
    drawing: [
      { type: "background", color: android.graphics.Color.argb(0, 0, 0, 0) },
    ],
    elements: {
      image: {
        type: "image",
        x: 0,
        y: 0,
        bitmap: "idea_book.book_open_0",
        scale: this.IMAGE_SCALE,
      },
    },
  });

  public static redrawImage(frame: int, scale: int) {
    IdeaUI.GUI.content.elements["image"] = {
      type: "image",
      x: 0,
      y: 0,
      bitmap: "idea_book.book_open_" + frame,
      scale: scale,
    };
    IdeaUI.GUI.forceRefresh();
    return;
  }
 
  public static setOffset(x: int, y?: int) {
    IdeaUI.GUI.content.location = {
      height: 500,
      width: 500,
      x: x,
      y: y || this.HEIGHT_LOCATION,
    };
    IdeaUI.GUI.forceRefresh();
    return;
  }

  public static close() {
    IdeaUI.GUI.close();
    IdeaUI.setOffset(this.WIDTH_LOCATION, this.HEIGHT_LOCATION);
    IdeaUI.redrawImage(0, this.IMAGE_SCALE);
  }

  public static initAnimation() {
    if (this.GUI.isOpened()) {
      return;
    };

    let x = this.WIDTH_LOCATION;
    let y = this.HEIGHT_LOCATION;

    let frame = 0;
    let timer = 0;

    let scale = this.IMAGE_SCALE;

    const RESULT_WIDTH = this.WIDTH_LOCATION * 2;
    const RESULT_HEIGHT = this.HEIGHT_LOCATION * 1.25



    IdeaUI.GUI.open();

    Threading.initThread("thread.infinite_forest.idea_animation", () => {
        while(true) {
          if(frame < this.FRAME_MAX) {

            IdeaUI.redrawImage(frame++, this.IMAGE_SCALE);
            java.lang.Thread.sleep(125);

          } else {

            if(timer < 5) {

              timer++;
              java.lang.Thread.sleep(500); 

            } else {

              if(x < RESULT_WIDTH) {
                IdeaUI.setOffset(x += 0.8, y);
              };

              if(y < RESULT_HEIGHT) {
                IdeaUI.setOffset(x, y += 0.4)
                IdeaUI.redrawImage(this.FRAME_MAX, scale-=0.2)
              };

              if(x === RESULT_WIDTH && y === RESULT_HEIGHT) {
                this.close();
                break;
              };
              java.lang.Thread.sleep(7);
            }
          }
        }
    })
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
  public static givePage(player: int, page: name) {
    IdeaUI.initAnimation();
    (BookUI.pagesList[Entity.getNameTag(player)] ??= ["main_title"]).push(page);
  }
  static {
    BookUI.UI.setCloseOnBackPressed(true);
    BookUI.UI.setBlockingBackground(true);
  }
}

Item.registerUseFunctionForID(VanillaItemID.coal, () => {
  IdeaUI.initAnimation();
});
