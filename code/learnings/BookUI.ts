abstract class BookUI {
  public static pagesList: Record<playerName, string[]> = {};
  protected constructor() {}
  protected static content = {
    drawing: [
      {
        type: "background",
        color: android.graphics.Color.argb(38, 22, 22, 22)
      },
      {
        type: "bitmap",
        bitmap: "book.learning_book_background",
        x: UI.getScreenHeight() / 3,
        y: 30,
        scale: 2
      }
    ],
    elements: {
      closeButton: {
        type: "closeButton",
        x: UI.getScreenHeight() - 274,
        y: 90,
        scale: 1.9,
        bitmap: "close_button"
      },
      buttonRight: {
        type: "button",
        x: UI.getScreenHeight() * 1.5,
        y: 372.5,
        scale: 3,
        bitmap: "book.right_button",
        bitmap2: "book.right_button_pressed",
        clicker: {
          onClick: BookUI.rightOnClick
        }
      },
      buttonLeft: {
        type: "button",
        x: UI.getScreenHeight() / 1.75,
        y: 372.5,
        scale: 3,
        bitmap: "book.left_button",
        bitmap2: "book.left_button_pressed",
        clicker: {
          onClick: BookUI.leftOnClick
        }
      },

      number1: {
        type: "text",
        x: UI.getScreenHeight() / 1.35,
        y: 375,
        font: {
          size: 15,
          color: android.graphics.Color.parseColor("#B8AC8F")
        },
        text: ERROR_WARNING
      },
      number2: {
        type: "text",
        x: UI.getScreenHeight() * 1.35,
        y: 375,
        font: {
          size: 15,
          color: android.graphics.Color.parseColor("#B8AC8F")
        },
        text: ERROR_WARNING
      },
    },
  } as UI.WindowContent;
  protected static drawPageNumbers() {
    const name = Entity.getNameTag(Player.getLocal());
    const content = BookUI.UI.getContent();
    const index = BookUI.findPageIndex();
    content.elements["number1"].text = (index).toString() 
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
      const content =
        BookPage.resultPages[
          BookUI.pagesList?.[name][index]
        ];
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
  public static setContent(content: {elements: UI.ElementSet, drawing: UI.DrawingSet}) {
    const concatedElements = Object.assign({}, BookUI.content.elements, content.elements);
    const concatedDrawings = [].concat(BookUI.content.drawing).concat(content.drawing.concat());
    BookUI.UI.setContent(
      Object.assign(
        {},
        { elements: concatedElements,
         drawing: concatedDrawings }
      ) as UI.WindowContent
    );
    BookUI.drawPageNumbers();
    BookUI.UI.forceRefresh();
  }
  public static getPagesFor(playerName: string): name[] {
    const list = BookUI.pagesList[playerName];
    if(!list) {
      return BookUI.pagesList[playerName] = ["main_title"]
    };
    return list;
  }
  public static openFor(player: int) {
    const playerName = Entity.getNameTag(player);
    const content =
      BookPage.resultPages[BookUI.getPagesFor(playerName)[0]];
    BookUI.setContent(content);
    BookUI.UI.open();
  };
  public static givePage(player: int, page: name) {
    (BookUI.pagesList[Entity.getNameTag(player)] ??= ["main_title"]).push(page);
  };
  static {
    BookUI.UI.setCloseOnBackPressed(true);
    BookUI.UI.setBlockingBackground(true);
  }
}




