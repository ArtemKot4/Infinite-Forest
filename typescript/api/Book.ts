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
  private static BOOK_ITEM = new FItem("learning_book", 1, "Learning Book", [
    "book",
    6,
  ]);
  private static pages: page_recorder = { forest: {}, base: {}, steam: {} };

  public static addPage(
    category: category,
    name: string,
    text: string,
    comment: string,
    recipe: any[]
  ): void {
    //let category;
    const pages = this.pages;
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

  public static setupPagesLogic(
    func: (page, index) => void,
    validation: UI.Window & category
  ): void {
    const pages = this.pages[validation];
    for (const index in pages) {
      if (validation.isOpened()) func(pages[index], index);
    }
  }
  public static onTick(): void {}
  private static MainUI = this.PagesUI();
  private static MainUIContainer = new UI.Container();
  static {
    Game.message("Book is generated!");
    this.BOOK_ITEM.onUse((coords, item, block) => {
      this.MainUIContainer.openAs(this.MainUI);
      Game.message("Interface is opened?")
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