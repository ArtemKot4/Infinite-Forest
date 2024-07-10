abstract class BookUI {
  protected static pagesContent() {}
  protected constructor() {}
  protected static content = {
    drawing: [
      {
        type: "background",
        color: android.graphics.Color.argb(0.85, 102, 102, 102),
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
        x: UI.getScreenHeight() / 1.05,
        y: 50,
        scale: 2.8,
        bitmap: "close_button",
      },
      buttonRight: {
        type: "button",
        x: UI.getScreenHeight() * 1.5,
        y: 365,
        scale: 3,
        bitmap: "book.right_button",
        bitmap2: "book.right_button_pressed",
      },
      buttonLeft: {
        type: "button",
        x: UI.getScreenHeight() / 1.75,
        y: 365,
        scale: 3,
        bitmap: "book.left_button",
        bitmap2: "book.left_button_pressed",
      },

      number1: {
        type: "text",
        x: UI.getScreenHeight() / 1.25,
        y: 365,
        font: {
          size: 15,
          color: android.graphics.Color.DKGRAY
        },
        text: ERROR_WARNING,
      },
      number2: {
        type: "text",
        x: UI.getScreenHeight() * 1.75,
        y: 365,
        font: {
          size: 15,
          color: android.graphics.Color.DKGRAY
        },
        text: ERROR_WARNING,
      },
      /*
       
      number1: {
        type: "text",
        x: UI.getScreenHeight() / 1.2,
        y: 365,
        font: {
          size: 15,
          color: android.graphics.Color.DKGRAY
        },
        text: ERROR_WARNING,
      },
      number2: {
        type: "text",
        x: UI.getScreenHeight() * 1.4,
        y: 365,
        font: {
          size: 15,
          color: android.graphics.Color.DKGRAY
        },
        text: ERROR_WARNING,
      }, 
       */
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
    alert(BookUI.UI.content.elements["leftTitle"].text);
    return findPageIndex;
  }

  protected static buttonFlip(index: int) {
    const name = Entity.getNameTag(Player.getLocal());
    if (BookUI.pagesList[name][index] !== undefined) {
      BookUI.setContent(
        BookPage.resultPages[(BookUI.pagesList[name] ??= ["main_title"])[index]]
      );
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
  public static setContent(elements: UI.ElementSet) {
    const concatedElements = Object.assign(BookUI.content.elements, elements);
    BookUI.UI.setContent(
      Object.assign({}, BookUI.content, concatedElements) as UI.WindowContent
    );
    BookUI.drawPageNumbers();
    BookUI.UI.forceRefresh();
  }
  public static pagesList: Record<playerName, string[]> = {};
  public static openFor(player: int) {
    const name = Entity.getNameTag(player);
    BookUI.setContent(
      BookPage.resultPages[(BookUI.pagesList[name] ??= ["main_title"])[0]]
    );
    BookUI.UI.open();
  }
}
