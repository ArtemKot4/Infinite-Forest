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
          };
          public open(): void {
            const data = Book.pages[this.category].UIData;
            if (!data)
              throw new Error("You need register Book.PagesUI(category) for open ui");
            data.container.openAs(data.ui);
          }
    }
