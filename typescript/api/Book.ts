type page_descriptor = {
  heading: string;
  text: string;
  comment: string;
  recipe?: any[];
};
type UIDataType = Record<"UIData", {ui: UI.Window, container: UI.Container}>;
type page_recorder = Record<category, Record<page, page_descriptor>> | UIDataType;
/**
 * Категории открытий в различных областях
 */
type category = "forest" | "base" | "steam";
type page = number;

abstract class Book {
  private static BOOK_ITEM = new FItem(
    "learning_book",
    1,
    "Learning Book",
    "book_default"
  );
  private static pages: page_recorder = { forest: {}, base: {}, steam: {} };
  public static data = {
    page: 0,
    max: 10,
  };
  public static addPage(
    category: category,
    heading: string,
    text: string,
    comment: string,
    ...element
  ): void {
    //let category;
    const pages = Book.pages;
    const last = Object.keys(pages).length + 1;
    let result = null;
    pages[category][last] = {};
    const assign = (obj?) =>
      ObjectAssign(
        pages[category][last],
        { heading: heading, text: text, comment: comment || "" },
        obj
      );

    if (element) {
      for (const i in element) {
        const elementKeys = Number(i) == 0 ? "element_" + 1 : "element_" + i;
        result = assign({ [elementKeys]: element[i] });
      }
    };
    return !!result ? result : assign();
  }
  public static PagesUI = (category, content?: Record<string, Object>) => {
    const category_ = Book.pages[category];
    let GUI: UI.Window;
    content
      ? (GUI = new UI.Window(ObjectAssign(GenericUIDescriptor, content)))
      : (GUI = new UI.Window(GenericUIDescriptor));
    category_.UIData = { ui: GUI, container: new UI.Container() };
  };

  private static MainUIContainer = new UI.Container();

  public static setupPagesLogic(
    func: (page, index) => void,
    category: category
  ): void {
    const pgs: UIDataType = Book.pages[category];
    const validation = pgs.UIData;
    Game.message("Сработало?");

    const data = Book.data;
    data.max = Object.keys(pgs).length;
    for (const index in pgs) {
      Game.message(
        "Book.data.page: " + data.page + "\n Book page number: " + index + "\nUi is Opened: " + validation.ui.isOpened() + 
        "\ndata.page & Number(index) ->" + data.page + " : " + Number(index) 
      );
      if (
        validation.ui.isOpened() == true &&
        (data.page == 0 || data.page == Number(index)))
       {
       
        func(pgs[index], index);
        const text = validation.container.setText;
        text("page", index);

        text("comment", pgs[index].comment);

        text("category", category);
        text("heading", pgs[index].heading);
        alert("Текст должен был поменяться!");
      }
    }
  }

  public static onTick(): void {
    Book.setupPagesLogic(
      (page, index) => {},
      "base"
    );
  }
  private static openCategoryUI(category: category): void {
    const data = Book.pages[category].UIData;
    if(!data) throw new Error("You need register Book.PagesUI(category) for open ui")
    data.container.openAs(data.ui)
  }
  private static visualByItem(): void {
    let data = 0;
    Book.BOOK_ITEM.iconOverride((item, isModUi) => {
      const ui: any = Book.pages["base"].UIData.container.isOpened();
      if (ui === true) {
        data < 13 ? (data = data + 1) : null;
      } else {
        data > 0 ? (data = data - 1) : null;
      }
      return { name: data > 0 ? "book_open" : "book_default", meta: data };
      //  }
    }, 12);
  }

  static {
    Game.message("Book is generated!");
    Book.BOOK_ITEM.onUse((coords, item, block) => {
      item.data = 0;
      Book.PagesUI("base");
      Book.openCategoryUI("base")
      Game.message(JSON.stringify(Book.data));
      Book.visualByItem();
    });
  }
}

const forest_pages: Record<int, page_descriptor> = {};

const addPages = (obj, category: category) => {
  for (const i in obj) {
    const pg = obj[i];
    Book.addPage(category, pg.name, pg.text, pg.comment, pg.recipe || null);
  }
};

addPages(forest_pages, "forest");

// const update: any = {update: Book.onTick()};
// Updatable.addUpdatable(update);
Book.addPage("base", "Это первая страница base", "lala", "ahah", []);
Book.addPage(
  "base",
  "Это вторая и самая мощная страница base",
  "lalaaaaaa",
  "ahah",
  []
);
