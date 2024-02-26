type modifier = "typewriter";
type text_descriptor = string | { text: string; modifier: modifier };
type page_descriptor = {
  heading: text_descriptor;
  text: text_descriptor;
  comment: text_descriptor;
  recipe?: any[];
};

type UIDataType = Record<"UIData", { ui: UI.Window; container: UI.Container }>;
type page_recorder =
  | Record<category, Record<page | "pages", page_descriptor | {}>>
  | UIDataType;
/**
 * Категории открытий в различных областях
 */
type category = "forest" | "base" | "steam";
type page = number;

abstract class Book {
  public static BOOK_ITEM = new FItem(
    "learning_book",
    1,
    "Learning Book",
    "book_default"
  );
  public static pages: page_recorder = {
    forest: { pages: {} },
    base: { pages: {} },
    steam: { pages: {} },
  };
  public static data = {
    page: 0,
    max: 10,
  };

  public static setupPagesLogic(
    func: (page, index) => void,
    category: category
  ): void {
    const pgs: UIDataType = Book.pages[category]["pages"];
    const uidata = Book.pages[category].UIData;
    Game.message("Сработало?");

    const data = Book.data;
    data.max = Object.keys(pgs).length;

      const container = uidata.container;

      Game.message(
        "Book.data.page: " +
          data.page +
          "\n Book page number: " +
          data.page +
          "\nUi is Opened: " +
          uidata.container.isOpened() +
          "\ndata.page & Number(index) ->" +
          data.page +
          " : " +
          Number(data.page)
      ); //TODO: DEBUG

      if (
        container &&
        container.isOpened() == true &&
        (data.page == 0 || data.page == Number(data.page))
      ) {
        const ind = pgs[data.page];
        const setup = (key) =>
          typeof ind[key] === "object" && ind[key]["modifier"]
            ? TextModifier.setModifier(
                uidata.container,
                ind[key],
                data.page,
                key,
                ind[key]["modifier"]
              )
            : ind[key];

        container.setText("page", data.page);

        container.setText("comment", setup("comment"));

        container.setText("category", category);
        container.setText("heading", setup("heading"));

        alert("Текст должен был поменяться!");
        return func(pgs[data.page], data.page);
      }
    }
  

  public static onTick(): void {
    //TODO: работаю над зонтиком
    //Book.setupPagesLogic((page, index) => {}, "base");
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

      //  new CategoryUI("base");
      Game.message(JSON.stringify(Book.data));
      Book.visualByItem();
    });
   
    
  }
}

// const update: any = {update: Book.onTick()};
// Updatable.addUpdatable(update);
Callback.addCallback("LevelDisplayed", () => {
  const objj = { hello: 10 };
  const assignn = ObjectAssign(objj, { hi: 20 }, { qq: 23, all: "ALLL" });
  Game.message(
    "TEST OBJECT ASSIGN: \n" +
      "obj: " +
      objj +
      "\nassign: " +
      assignn +
      "\nОни одинаковы?"
  );
})