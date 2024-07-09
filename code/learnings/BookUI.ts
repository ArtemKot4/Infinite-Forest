abstract class BookUI {
  protected static pagesContent() {}
  protected constructor() {};
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
        "closeButton": {
            type: "closeButton",
            x: UI.getScreenHeight() * 0.35,
            y: 10,
            scale: 3,
            bitmap: "close_button"
        },
        "buttonRight": {
          type: "button",
          x: UI.getScreenHeight() * 0.4,
          y: 350,
          scale: 3
        },
        "buttonLeft": {
          type: "button",
          x:  UI.getScreenHeight() * 1.75,
          y: 350,
          scale: 3
        }
    }
  } as UI.WindowContent;
  protected static UI = new UI.Window(BookUI.content as UI.WindowContent);
  public static setContent(elements: UI.ElementSet) {
    const concatedElements = Object.assign(BookUI.content.elements, elements);
    BookUI.UI.setContent(Object.assign({}, BookUI.content,concatedElements ) as UI.WindowContent);
    BookUI.UI.forceRefresh();
  };
  public static pagesList: Record<playerName, string[]> = {}
  public static openFor(player: int) {
    const name = Entity.getNameTag(player);
    BookUI.setContent(BookPage.resultPages[(BookUI.pagesList[name] ??= ["book_title"])[0]]);
    BookUI.UI.open();
    Game.message(JSON.stringify(BookPage.resultPages));
    Game.message(JSON.stringify(BookUI.pagesList[name]));
  }
}
