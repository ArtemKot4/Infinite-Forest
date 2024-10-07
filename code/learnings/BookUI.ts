namespace Book {

export interface ISectionList {
  default: {
    pages: string[],
  },
  cauldron: {
    pages: string[]
  },
  sign: {
    pages: string[]
  }
}

export let currentSection = "default" as keyof ISectionList;

export abstract class GraphicUI {
  public static pagesList: Record<playerName, ISectionList> = {};
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
          onClick: GraphicUI.rightOnClick,
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
          onClick: GraphicUI.leftOnClick,
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
    const content = GraphicUI.UI.getContent();
    const index = GraphicUI.findPageIndex();
    content.elements["number1"].text = index.toString();
    content.elements["number2"].text = (index + 1).toString();
  }

  protected static findPageIndex() {
    const playerName = Entity.getNameTag(Player.getLocal());
    const index = GraphicUI.pagesList[playerName][currentSection].pages.findIndex((v) =>
      (GraphicUI.UI.content.elements["leftTitle"].text as string).includes(
        Translation.translate(v)
      )
    );
    return index;
  }

  protected static buttonFlip(index: int) {
    const playerName = Entity.getNameTag(Player.getLocal());
    if (GraphicUI.pagesList[playerName][currentSection].pages[index] !== undefined) {
      const content = BookPage.resultPages[GraphicUI.pagesList[playerName][currentSection].pages[index]];
      return GraphicUI.setContent(content);
    }
  }
  protected static rightOnClick(
    position: Vector,
    container: com.zhekasmirnov.innercore.api.mod.ui.container.UiAbstractContainer
  ) {
    return GraphicUI.buttonFlip(GraphicUI.findPageIndex() + 1);
  }
  protected static leftOnClick(
    position: Vector,
    container: com.zhekasmirnov.innercore.api.mod.ui.container.UiAbstractContainer
  ) {
    return GraphicUI.buttonFlip(GraphicUI.findPageIndex() - 1);
  }
  public static UI = new UI.Window(GraphicUI.content as UI.WindowContent);
  public static setContent(content: {
    elements: UI.ElementSet;
    drawing: UI.DrawingSet;
  }) {
    const concatedElements = Object.assign(
      {},
      GraphicUI.content.elements,
      content.elements
    );

    const concatedDrawings = []
      .concat(GraphicUI.content.drawing)
      .concat(content.drawing.concat());

    GraphicUI.UI.setContent(
      Object.assign(
        {},
        { elements: concatedElements, drawing: concatedDrawings }
      ) as UI.WindowContent
    );

    GraphicUI.drawPageNumbers();
    GraphicUI.UI.forceRefresh();
  }

  public static initializeSections(playerName: name) {
    let data = GraphicUI.pagesList[playerName] ??= {} as ISectionList;

    for(const section of Object.keys(Section.list)) {
      if(!data[section]) {
        data[section] = {
          pages: []
        }
      }
    }

  if(data.default.pages.length === 0) {
    data.default.pages.push("main_title")
  }

    }

  public static getPagesFor(playerName: string): name[] {

      return GraphicUI.pagesList[playerName][currentSection].pages;
   
  }
  public static openFor(player: int) {

    const playerName = Entity.getNameTag(player);
    const content = BookPage.resultPages[GraphicUI.getPagesFor(playerName)[0]];
    
    Section.initSectionButtons(playerName);

    GraphicUI.setContent(content);
    GraphicUI.UI.open();
  }

  static {
    GraphicUI.UI.setCloseOnBackPressed(true);
    GraphicUI.UI.setBlockingBackground(true);
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

}