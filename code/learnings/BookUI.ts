abstract class BookUI {
  protected static pagesContent() {}
  protected constructor() {};
  protected static content = {
    drawing: [
      {
        type: "bitmap",
        bitmap: "learning_book_background",
        x: UI.getScreenHeight() * 0.75,
        y: 5,
        scale: 3,
      },
    ],
    elements: {
        "closeButton": {
            type: "closeButton",
            x: UI.getScreenHeight() * 0.5,
            y: 10,
            scale: 3,
            bitmap: "close_button"
        },
        "buttonRight": {
          type: "button",
          x: UI.getScreenHeight() * 0.75,
          y: 100,
          scale: 3
        },
        "buttonLeft": {
          type: "button",
          x:  UI.getScreenHeight() * 0.35,
          y: 100,
          scale: 3
        }
    }
  } as UI.WindowContent;
  protected static UI = new UI.Window(BookUI.content as UI.WindowContent);
  public static setContent(elements: UI.ElementSet) {
    const concatedElements = Object.assign(BookUI.content.elements, elements);
    BookUI.UI.setContent(Object.assign({}, BookUI.content,concatedElements ) as UI.WindowContent)
  };
}
