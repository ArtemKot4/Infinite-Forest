type modifier = "keyboard";
type text_descriptor = string | { text: string; modifier: modifier };
type page_descriptor = {
  heading: text_descriptor;
  text: text_descriptor;
  comment: text_descriptor;
  recipe?: any[];
};
type UIDataType = Record<"UIData", { ui: UI.Window; container: UI.Container }>;
type page_recorder =
  | Record<category, Record<page, page_descriptor>>
  | UIDataType;
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
  public static pages: page_recorder = { forest: {}, base: {}, steam: {} };
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
    const last = Object.keys(pages).length - 1;
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
    }
    return !!result ? result : assign();
  }
 

  private static MainUIContainer = new UI.Container();

  public static setupPagesLogic(
    func: (page, index) => void,
    category: category
  ): void {
    const pgs: UIDataType = Book.pages[category];
    const uidata = pgs.UIData;
    Game.message("Сработало?");

    const data = Book.data;
    data.max = Object.keys(pgs).length - 1;
    for (const index in pgs) {
      Game.message(
        "Book.data.page: " +
          data.page +
          "\n Book page number: " +
          index +
          "\nUi is Opened: " +
          uidata.container.isOpened() +
          "\ndata.page & Number(index) ->" +
          data.page +
          " : " +
          Number(index)
      ); //TODO: DEBUG
      if (
        uidata.container && 
        uidata.container.isOpened() == true &&
        (data.page == 0 || data.page == Number(index))
      ) {


        
        const text = uidata.container.setText;
        text("page", index);

        text("comment", // data_text.comment || 
        pgs[index].comment || "invalid");

        text("category", category);
        text("heading", //data_text.heading ||
        pgs[index].heading || "invalid");
        alert("Текст должен был поменяться!");
        return func(pgs[index], index);
      }
    }
  }

  public static onTick(): void {
    Book.setupPagesLogic((page, index) => {
    }, "base");
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
      new CategoryUI("base").open();
      new CategoryUI("forest");
      new CategoryUI("steam");
    //  new CategoryUI("base");
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
