abstract class BookUI {
  protected static pagesContent() {}
  protected constructor() {}
  protected static content = {
    drawing: [
      {
        type: "background",
        color: android.graphics.Color.argb(0, 0, 0, 0),
      },
      {
        type: "bitmap",
        bitmap: "book.learning_book_background",
        x: UI.getScreenHeight() * 0.3,
        y: 15,
        scale: 1.5,
      },
    ],
    elements: {
      closeButton: {
        type: "closeButton",
        x: UI.getScreenHeight() / 2,
        y: 65,
        scale: 3,
        bitmap: "close_button",
      },
      buttonRight: {
        type: "button",
        x: UI.getScreenHeight() * 1.5,
        y: 250,
        scale: 3,
        bitmap: "book.right_button",
        bitmap2: "book.right_button_pressed",
        clicker: {
          onClick: BookUI.rightOnClick,
        },
      },
      buttonLeft: {
        type: "button",
        x: UI.getScreenHeight() / 2,
        y: 250,
        scale: 3,
        bitmap: "book.left_button",
        bitmap2: "book.left_button_pressed",
        clicker: {
          onClick: BookUI.leftOnClick,
        },
      },
      number1: {
        type: "text",
        x: UI.getScreenHeight() / 1.5,
        y: 300,
        font: {
          size: 15,
        },
        text: "error 1",
      },
      number2: {
        type: "text",
        x: UI.getScreenHeight() * 1.5,
        y: 300,
        font: {
          size: 15,
        },
        text: "error 2",
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
    const content = BookUI.UI.getContent();
    const findPageIndex = BookUI.pagesList[playerName].findIndex(
      (v) => v === content.elements["leftTitle"].text
    );
    return findPageIndex;
  }

  protected static buttonFlip(index: int) {
    const name = Entity.getNameTag(Player.getLocal());
    if (BookUI.pagesList[name][index] !== undefined) {
      BookUI.setContent(
        BookPage.resultPages[
          (BookUI.pagesList[name] ??= ["main_title"])[index]
        ]
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
  protected static UI = new UI.Window(BookUI.content as UI.WindowContent);
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
