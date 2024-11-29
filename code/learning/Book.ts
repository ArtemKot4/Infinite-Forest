class Book {

    public static UI: UI.Window = (() => {
  
        const Window = new UI.Window();
        
        Window.setCloseOnBackPressed(true);
        Window.setBlockingBackground(true);
        Window.setDynamic(true);

        return Window;
    })();

    public static pageIndex = 0;

    public section = "default";

    public static open() {
       alert("Я открыта")
    };

    public static close() {
       alert("Я закрыта")
    };

    public static draw() {
       Flags.getFor(Player.getLocal()).book
    }

    static {

        Book.UI.setEventListener({
            onOpen: Book.open,
            onClose: Book.close
        });

    }

    static Page = class {
        public static list: Record<string, IPageDescription> = {};

        constructor(public name: string, public description: IPageDescription) {
            Book.Page.list[name] = description;
        };

        public static readFromJSON(dir: string) {

            const FilesList = FileTools.GetListOfFiles(
                dir,
                ""
              );

              for (const dir of FilesList) {

                const instance = JSON.parse(
                  FileTools.ReadText(dir.getAbsolutePath())
                ) as IPageDescription;

                if(!!instance) {

                     if(!instance.name) {
                         throw new NoSuchFieldException("reading book pages error: name is not defined!");
                     };
                     
                     Book.Page.list[instance.name] = instance;
                }
        
           }
       }
    }
}

type JSONLang = {
    en: "",
    ru: ""
}

type IPageFilling = {
   title: JSONLang,
   subtitle: JSONLang,
   text: JSONLang
};

type IPageDirection = IPageFilling & {icon?: string, description: JSONLang};

interface IPageDescription {
    name?: string,

    left: IPageFilling,
    right: IPageDescription,

    directions: {
        first: IPageDirection,
        second: IPageDirection,
        third: IPageDirection,
        side?: "left" | "right"
    }

}