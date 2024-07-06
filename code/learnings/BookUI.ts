abstract class BookUI {
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
        }
    }
  };
  protected static UI = new UI.Window(BookUI.content as UI.WindowContent);
  public static setContent(content: {}) {
    BookUI.UI.setContent(Object.assign({}, BookUI.content, content) as UI.WindowContent)
  };
}
