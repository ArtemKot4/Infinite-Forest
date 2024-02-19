class CategoryUI {
  public category: category;
  constructor(category, content?: Record<string, Object>) {
    this.category = category;
    const category_ = Book.pages[category];
    let GUI: UI.Window;
    content
      ? (GUI = new UI.Window(ObjectAssign(GenericUIDescriptor, content)))
      : (GUI = new UI.Window(GenericUIDescriptor));
    category_.UIData = { ui: GUI, container: new UI.Container() };
  }

  public addPage(
    heading: string,
    text: string,
    comment: string,
    ...element
  ): {} {
    //let category;
    const pages = Book.pages[this.category]["pages"];
    const last = Object.keys(pages).length + 1;
    let result = null;
    pages[last] = {};
    const assign = (obj?) =>
      ObjectAssign(
        pages[last],
        { heading: heading, text: text, comment: comment || "" },
        obj
      );

    if (element) {
      for (const i in element) {
        const elementKeys = Number(i) == 0 ? "element_" + 1 : "element_" + i;
        result = assign({ [elementKeys]: element[i] });
      }
    }
    return !!result ? result : assign();
  }

  public open(): void {
    const data = Book.pages[this.category].UIData;
    if (!data)
      throw new Error("You need register Book.PagesUI(category) for open ui");
    data.container.openAs(data.ui);
  }

  static {
    Book.BOOK_ITEM.onUse((coords, item, block) => {
      const baseUI = new CategoryUI("base");
      baseUI.open();
      const forestUI = new CategoryUI("forest");
      const steamUI = new CategoryUI("steam");

      baseUI.addPage("Это первая страница base", "lala", "ahah", []);
      baseUI.addPage(
        "Это вторая и самая мощная страница base",
        "lalaaaaaa",
        "ahah",
        []
      );
    });
  }
}
