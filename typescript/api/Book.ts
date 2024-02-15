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
  static {
    Game.message("Book is generated!");
  }

  private static page: page_recorder = { forest: {}, base: {}, steam: {} };
  private static pages: Record<number, page_descriptor> = {
    1: {
      name: "Base",
      text: "Learnings",
      comment: "In this i must wrote need learns",
      recipe: ["ds"],
    },
  };

  public static addPage(
    category: category,
    name: string,
    text: string,
    comment: string,
    recipe: any[]
  ) {
    //let category;
    const pages = this.pages;
    const last = Object.keys(pages).length + 1;
    pages[category][last] = {
      name: name,
      text: text,
      comment: comment,
      recipe: recipe,
    };
  };
  public static PagesUI = (content) => {
    const GenericUI = new UI.Window({
        //* Общий прототип каждой страницы
    });
     ObjectAssign(GenericUI, content);
        return GenericUI;
  };

  public static setupPagesLogic(
    func: (page, index) => void,
    validation: UI.Window & category
  ) {
    const pages = this.pages[validation];
    for (const index in pages) {
      if (validation.isOpened()) func(pages[index], index);
    }
  }
  public static onTick(): void {

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
