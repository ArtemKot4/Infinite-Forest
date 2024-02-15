type page_descriptor = {
  name: string;
  text: string;
  comment: string;
  recipe?: any[];
};
type page_recorder = Record<category, Record<page, page_descriptor>>;
/**
 * Категории открытий в различных областях
 */
type category = "forest" | "base" | "steam";
type page = number;

abstract class Book {
  private static BOOK_ITEM = new FItem("learning_book", 1, "Learning Book", "book_default");
  private static pages: page_recorder = { forest: {}, base: {}, steam: {} };
 

  public static addPage(
    category: category,
    name: string,
    text: string,
    comment: string,
    recipe: any[]
  ): void {
    //let category;
    const pages = Book.pages;
    const last = Object.keys(pages).length + 1;
    pages[category][last] = {
      name: name,
      text: text,
      comment: comment,
      recipe: recipe,
    };
  }

  public static PagesUI = (content?: Record<string, Object>) =>
    content
      ? new UI.Window(ObjectAssign(GenericUIDescriptor, content))
      : new UI.Window(GenericUIDescriptor);

      private static MainUI = Book.PagesUI();
      private static MainUIContainer = new UI.Container();

  public static setupPagesLogic(
    func: (page, index) => void,
    validation: UI.Window & category
  ): void {
    const pages = Book.pages[validation];
    for (const index in pages) {
      if (validation.isOpened()) func(pages[index], index);
    }
  };

  public static onTick(): void {};
  private static visualByItem(): void {

      Book.BOOK_ITEM.iconOverride((item, isModUi) => {
     let data = item.data;
     const ui = Book.MainUI.isOpened();
     if(ui === true) {data < 13 ? data = data + 1 : null;
       alert("Ui is opened for icon change") }
      else { data > 0 ? data = data - 1 : null; };
      Game.message("data: " + data)
     return {name: "book_open", meta: data};
      //  }
      }, 5)
    }

  static {
    Game.message("Book is generated!");
    Book.BOOK_ITEM.onUse((coords, item, block) => {
      item.data = 0;
      Game.message("onUse item.data: " + item.data)
      Book.MainUIContainer.openAs(Book.MainUI);
      Game.message("Interface is opened?");
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