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
          onClick: () => GraphicUI.rightOnClick,
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
          onClick: () => GraphicUI.leftOnClick,
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

  protected static getButtonsContentFor(section: keyof ISectionList) {
    section ??= Section.getCurrent();

         const buttonLeft = {...GraphicUI.UI.content.elements.buttonLeft};
         const buttonRight = {...GraphicUI.UI.content.elements.buttonRight};

         buttonLeft.clicker.onClick = GraphicUI.leftOnClick.bind({}, section);
         buttonRight.clicker.onClick = GraphicUI.rightOnClick.bind({}, section);

         return {
          buttonLeft,
          buttonRight
         };
  }

  protected static drawPageNumbers(section?: keyof ISectionList) {

    const content = GraphicUI.UI.getContent();
    const index = GraphicUI.findPageIndex(section);

    content.elements["number1"].text = index.toString();
    content.elements["number2"].text = (index + 1).toString();
  }

  protected static findPageIndex(section?: keyof ISectionList) {
    const playerName = Entity.getNameTag(Player.getLocal());
    const pageList = this.getPagesFor(playerName, section);

    const index = pageList.findIndex((v) =>
      (GraphicUI.UI.content.elements["leftTitle"].text as string).includes(
        Translation.translate(v)
      )
    );

    return index;
  }

  protected static buttonFlip(section: keyof ISectionList, pageNumber: int) {
      return GraphicUI.updateFor(section, pageNumber);
  };

  protected static rightOnClick(
   section: keyof ISectionList
  ) {
    return GraphicUI.buttonFlip(section, GraphicUI.findPageIndex(section) + 1);
  };

  protected static leftOnClick(
    section: keyof ISectionList
  ) {
    return GraphicUI.buttonFlip(section, GraphicUI.findPageIndex(section) - 1);
  };

  public static UI = new UI.Window(GraphicUI.content as UI.WindowContent);

  public static setContent(section?: keyof ISectionList, pageNumber: int = 0) {
   
    const playerName = Entity.getNameTag(Player.getLocal());
    const existingContent = BookPage.resultPages[GraphicUI.getPagesFor(playerName)[pageNumber]];
    const concatedElements = Object.assign(
      {},
      GraphicUI.content.elements,
      GraphicUI.getButtonsContentFor(section),
      existingContent.elements
    
    );

    const concatedDrawings = []
      .concat(GraphicUI.content.drawing)
      .concat(existingContent.drawing);

  Game.message("concatedElements: -> " + __debug_typecheck__(concatedElements));
  Game.message("concatedDrawings: -> " + __debug_typecheck__(concatedDrawings));
  Game.message("existingContent: -> " + __debug_typecheck__(existingContent));
  Game.message("GraphicUI.getButtonsContentFor(section): -> " + __debug_typecheck__(GraphicUI.getButtonsContentFor(section)));
  Game.message("existingContent.elements: -> " + __debug_typecheck__(existingContent.elements));
  Game.message("GraphicUI.content.elements: -> " + __debug_typecheck__(   GraphicUI.content.elements));
  Game.message("GraphicUI.content.drawing: -> " + __debug_typecheck__(GraphicUI.content.drawing));
  Game.message("existingContent.drawing: -> " + __debug_typecheck__(existingContent.drawing));

    GraphicUI.UI.setContent(
      Object.assign(
        {},
        { elements: concatedElements, drawing: concatedDrawings }
      )// as UI.WindowContent
    );

    GraphicUI.drawPageNumbers(section);
    GraphicUI.UI.forceRefresh();
  }

  public static initializeSections(playerName: name) {
    const data = GraphicUI.pagesList[playerName] ??= {} as ISectionList;

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

  public static getPagesFor(playerName: string, section?: keyof ISectionList): name[] {
 Game.message(JSON.stringify(GraphicUI.pagesList[playerName][section || Section.getCurrent()])) //TODO: DELETE DEBUG MESSAGE

      return GraphicUI.pagesList[playerName][section || Section.getCurrent()].pages;
   
  };

  public static openFor(player: int) {

    const playerName = Entity.getNameTag(player);

    Section.initSectionButtons(playerName);

    GraphicUI.setContent();
    GraphicUI.UI.open();
  };

  public static updateFor(section: keyof ISectionList, pageNumber: int) {
      Section.setCurrent(section);
      GraphicUI.setContent(section, pageNumber);
  }


  static {
    GraphicUI.UI.setCloseOnBackPressed(true);
    GraphicUI.UI.setBlockingBackground(true);
  }
}

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