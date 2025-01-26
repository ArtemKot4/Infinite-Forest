class BookPage {

    public static list: Record<string, Record<string, IPageDescription>> = {
        "default": {},
        "cauldron": {}
    };

    constructor(public name: string, public description: IPageDescription) {
       
        (BookPage.list[description.section || "default"] ??= {})[name] = description;

        BookPage.translatePage(description);

    };

    public static translateElements(elements: BookCustomElements[]): void {
        for(const element of elements) {

            if(element.type === "native_text") {

                if(element.text) {
                    this.translateJSONLang(element.text);
                };

            };

        };
    };

    public static translateJSONLang(lang: JSONLang) {

        if(lang && lang instanceof Object && "en" in lang) {
            Translation.addTranslation(lang.en, lang); 
        };
       
    };

    public static translatePage(description: IPageDescription) {
        if(description.left) {

            if(description.left.title) BookPage.translateJSONLang(description.left.title.text);
            if(description.left.subtitle) BookPage.translateJSONLang(description.left.subtitle.text);
            if(description.left.text) BookPage.translateJSONLang(description.left.text.text);

            if(description.left.elements) BookPage.translateElements(description.left.elements);
            
        };

        if(description.right) {
              
            if(description.right.title) BookPage.translateJSONLang(description.right.title.text);
            if(description.right.subtitle) BookPage.translateJSONLang(description.right.subtitle.text);
            if(description.right.text) BookPage.translateJSONLang(description.right.text.text);

            if(description.right.elements) BookPage.translateElements(description.right.elements);
            
        };
    };

    public static loadFromJSON(dir: string) {

        const FilesList = FileTools.GetListOfFiles(
            dir,
            ""
          );

        for (const dir of FilesList) {

            const instance = JSON.parse(FileTools.ReadText(dir.getAbsolutePath())) as IPageDescription;

            if(!!instance) {

                if(!instance.name) {
                    throw new NoSuchFieldException("load book pages error: name is not defined!");
                };
                 
                (BookPage.list[instance.section || "default"] ??= {})[instance.name] = instance;
                 
                BookPage.translatePage(instance);

            };
    
        };
    };

    public static separateText(text: string) {
        let result = [];
        let line = "";
    
        for (let word of text.split(" ")) {
            if (line.length + word.length <= 25) {
                line += word + " ";
            } else {
                result.push(line.trim());
                line = word + " ";
            }
        }
    
        if (line) {
            result.push(line.trim());
        }
    
        return result.join("\n");
    };

    public static getTextContent(text: string, x: number, y: number, size: number, color: number, align: number, alignment: number, bold: boolean, cursive: boolean, underline: boolean, shadow: number): UI.UITextElement {
        return {
            type: "text",
            multiline: true,
            font: {
                size: size,
                 color: color,
                  align: align || UI.Font.ALIGN_DEFAULT,
                   alignment: alignment || UI.Font.ALIGN_DEFAULT,
                   bold: bold || false,
                  cursive: cursive || false,
                 underline: underline || false,
                shadow: shadow || 0
            },
            x: x,
            y: y,
            text: BookPage.separateText(text)
        };
    };

    public static drawTitle(side: IBookSide, filling: IPageFilling, default_x: number, default_y: number): void {

        if(!filling.title) return;

        const {x, y, color, size, shadow, alignment, align, cursive, underline, bold} = filling.title.data ?? {};

        Book.UI.content.elements[side + "_title"] = BookPage.getTextContent(
            Translation.translate(filling.title.text.en), 
             (x || 0) + default_x, 
              (y || 0) + default_y, 
               size || 20, 
                color || android.graphics.Color.parseColor("#00A416"), 
                align, 
                alignment, 
               bold || true, 
              cursive, 
             underline, 
            shadow
        );

    };

    public static drawSubtitle(side: IBookSide, filling: IPageFilling, default_x: number, default_y: number): void {

        if(!filling.subtitle) return;

        const {x, y, color, size, shadow, alignment, align, cursive, underline, bold} = filling.subtitle.data ?? {};

        Book.UI.content.elements[side + "_subtitle"] = BookPage.getTextContent(
            Translation.translate(filling.subtitle.text.en), 
             (x || 0) + default_x, 
              (y || 0) + default_y, 
               size || 16.5, 
                color || android.graphics.Color.parseColor("#194D33"), 
                align, 
                alignment, 
               bold, 
              cursive, 
             underline, 
            shadow
        );

    };

    public static drawText(side: IBookSide, filling: IPageFilling, default_x: number, default_y: number): void {

        if(!filling.text) return;

        const {x, y, color, size, shadow, alignment, align, cursive, underline, bold} = filling.text.data ?? {};

        Book.UI.content.elements[side + "_text"] = BookPage.getTextContent(
            Translation.translate(filling.text.text.en), 
             (x || 0) + default_x, 
              (y || 0) + default_y, 
               size || 12.5, 
                color || android.graphics.Color.parseColor("#9E9E9E"), 
                align, 
                alignment, 
               bold, 
              cursive, 
             underline, 
            shadow
        );

    };

    public static drawIndexes(index: number) {
        const content = Book.UI.content;

        content.elements.index_1.text = index;
        content.elements.index_2.text = index + 1;
    };

    public static initLink(content: UI.Elements, link: string) {
        if(!link) return;

        const [section, name] = link.split(":", 2);

        if(!(section in BookPage.list)) {
            throw new NoSuchFieldException("link page error: section is not exists");
        };

    //     const list = Flags.getFor(Player.getLocal()).book.sectionList;

    //     if(section in list) {
    //         const index = Object.keys(list[section]).findIndex((v) => v == name);

    //         if(index >= 0) {
                    
    //             content.clicker = {
    //                 onLongClick: (position, container) => BookPage.drawAll(section, index)
    //             };

    //         };
    //    };
    };

    public static drawPictures(filling: IPageFilling, default_x: number, default_y: number) {
        if(!filling.pictures) return;

        for(const picture of filling.pictures) {

            if(!picture.texture) {
                throw new NoSuchFieldException(`drawing pictures error! title of page: ${Translation.translate(filling.text.text.en)}`)
            };

            let content = {
                type: "image",
                bitmap: "book." + picture.texture,
                x: default_x + (picture.x || 0),
                y: default_y + (picture.y || 0),
            } as UI.UIImageElement | UI.UISlotElement;

            if(picture.scale) {
                content.scale = picture.scale;
            };

            if(picture.type && picture.type === "item") {
                content.type = "slot";
                content.bitmap = "unknown"
                content.source = new ItemStack(parseID(picture.texture), 1, 0);
            };

            BookPage.initLink(content, picture.link);
            Book.UI.content.elements[`picture.${picture.texture}:${Math.random()}`] = content;

        };
    }


    public static drawElements(filling: IPageFilling, default_x: number, default_y: number) {
        if(!filling.elements) return;

        for(const element of filling.elements) {

            let content = Object.assign(element, {
                x: element.x + default_x,
                y: element.y + default_y
            }) as UI.Elements;

            if(element.type === "native_text" && element.text instanceof Object) {
                content = this.getTextContent(
                    element.text.en, 
                     content.x, 
                      content.y, 
                       element.size, 
                        element.color, 
                        element.align, 
                        element.alignment, 
                       element.bold, 
                      element.cursive, 
                     element.underline, 
                    element.shadow
                );
            };

            BookPage.initLink(content, element.link);
            Book.UI.content.elements[`element:${element.type}:Math.random()`] = content;
       
        };
    };

    public static drawAll(section: string, index: number) {
        if(!(section in BookPage.list)) {
            throw new NoSuchFieldException("Error in section find: section is not exists in system")
        }
   
        const pagesList = Book.getPagesForSection(section);

        const nearIndex = Math.min(pagesList.length - 1, index);

        const page = pagesList[nearIndex];

        const [name, direction] = page;

        const context = BookPage.list[section][name];

        if(!context) {
            throw new NoSuchFieldException("Error! Page is not exists in system");
        };

        Book.pageIndex = nearIndex;
        Book.currentSection = section;

        this.drawTitle("left", context.left, UI.getScreenHeight() / 1.95, 60);
        this.drawTitle("right", context.right, UI.getScreenHeight() * 1.1 + 5, 60);

        this.drawSubtitle("left", context.left, UI.getScreenHeight() / 1.95, 85); 
        this.drawSubtitle("right", context.right, UI.getScreenHeight() * 1.1 + 5, 85); 

        this.drawText("left", context.left, UI.getScreenHeight() / 1.95, 110);
        this.drawText("right", context.right, UI.getScreenHeight() * 1.1 + 5, 110);

        this.drawPictures(context.left, UI.getScreenHeight() / 2.7, 120);
        this.drawPictures(context.right, UI.getScreenHeight() + 45, 120);

        this.drawElements(context.left, UI.getScreenHeight() / 1.95, 110);
        this.drawElements(context.right, UI.getScreenHeight() * 1.1, 110);

        this.drawIndexes(index);

        Book.UI.forceRefresh();

        Game.message("Контент для страницы: " + name + " -> " + "\n" + JSON.stringify(Book.UI.content)); //todo: debug

        Game.message("nearIndex: -> " + nearIndex)

    }
};

class Book {

    protected constructor() {};

    private static getPageListWithObj(obj: Record<string, number>, section: string) {
        const list = [];

        for(const learning_name in obj) {
            const learning = Learning.get(learning_name);

            if(learning && learning.section === section) {
                list.push([learning.name, obj[learning_name]]);
            }
        };

        return list;
    }
    public static getPagesForSection(section: string): [string, number][] {
        const objectPlayer = ObjectPlayer.get(Player.getLocal());

        if(!objectPlayer) {
            return [];
        };

                
        let list: ReturnType<typeof this.getPagesForSection> = []
        .concat(this.getPageListWithObj(objectPlayer.learningList, section))
        //.concat(this.getPageListWithObj(objectPlayer.reflectionList, section));
        
        return list;
    }

    public static getDefaultContent(): UI.WindowContent {
        return {
             drawing: [
                {
                    type: "background",
                    color: android.graphics.Color.argb(38, 22, 22, 22),
                },
                {
                    type: "bitmap",
                    bitmap: "book.background",
                    x: UI.getScreenHeight() / 3,
                    y: 15,
                    scale: 2.1,
                },
            ],
            elements: {
                close_button: {
                    type: "button",
                    x: UI.getScreenHeight() - 260,
                    y: 235,
                    scale: 1.8,
                    bitmap: "close_button",
                    clicker: {
                        onClick: (position, container) => Book.close()
                    }
                },
                right_button: {
                    type: "button",
                    x: UI.getScreenHeight() * 1.5,
                    y: 372.5,
                    scale: 3,
                    bitmap: "book.right_button",
                    bitmap2: "book.right_button_pressed",
                    clicker: {
                        onClick: () => BookPage.drawAll(Book.currentSection, Book.pageIndex + 1)
                    }
                },
                left_button: {
                    type: "button",
                    x: UI.getScreenHeight() / 1.75,
                    y: 372.5,
                    scale: 3,
                    bitmap: "book.left_button",
                    bitmap2: "book.left_button_pressed",
                    clicker: {
                        onClick: () => BookPage.drawAll(Book.currentSection, Book.pageIndex - 1)
                    }
                },
                index_1: {
                    type: "text",
                    x: UI.getScreenHeight() / 1.35,
                    y: 375,
                    font: {
                        size: 15,
                        color: android.graphics.Color.parseColor("#B8AC8F"),
                    },
                    text: "-1"
                },
                index_2: {
                    type: "text",
                    x: UI.getScreenHeight() * 1.35,
                    y: 375,
                    font: {
                        size: 15,
                        color: android.graphics.Color.parseColor("#B8AC8F"),
                    },
                    text: "-1"
                }
            } 
        };
    };

    public static readonly UI: UI.Window = (() => {
        const Window = new UI.Window();
        
        Window.setBlockingBackground(true);
        Window.setTouchable(true);
        Window.setDynamic(true);

        Window.setContent(Book.getDefaultContent());

        return Window;
    })();

    public static pageIndex = 0;

    public static currentSection = "default";

    public static open() {
        Book.UI.open();
        BookPage.drawAll(Book.currentSection, 0);
    };

    public static close() {
        Book.UI.close();
        Book.UI.setContent(Book.getDefaultContent());
    };

};

class BookItem extends ItemForest {

    public static instance = new BookItem();

    constructor() {
        super("forest_diary", {name: "forest_diary", meta: 0}, 1);
    };

    public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        Book.open();
    };

    public onNameOverride(item: ItemInstance, translation: string, name: string): string {
        return Native.Color.GREEN + Translation.translate(name)
    };

    static {
        Callback.addCallback("EntityAdded", (entity) => {

            if(Entity.getType(entity) === Native.EntityType.PLAYER) {

                const player = new PlayerEntity(entity);

                const itemsInHands = [player.getCarriedItem().id, Entity.getOffhandItem(entity).id];

                if(itemsInHands.includes(BookItem.instance.getID())) {
                    return;
                };

                for(let i = 0; i < 36; i++) {
                    if(player.getInventorySlot(i).id === BookItem.instance.getID()) {
                        return;
                    };
                };

                player.addItemToInventory(BookItem.instance.getID(), 1, 0);
                
            };
        });
    };
};


type IBookSide = "left" | "right";

interface IPageTextElement {
    text: JSONLang, 
    data?: {x?: number, y?: number} & UI.FontDescription
};

interface BookTextElement extends UI.FontDescription {
    type: "native_text",
    x: number,
    y: number,
    text: JSONLang
}

type BookCustomElements = (UI.Elements | BookTextElement) & {link?: string};

type IPageFilling = {
    title: IPageTextElement,
    subtitle: IPageTextElement,
    text: IPageTextElement,

    /**
    * @param texture name of texture
    * @param link name of section and page in format section:page. For example, default:main
    * @param type type of texture
    */

    pictures?: {x: number, y: number, scale: number, texture: string, link?: string, type?: "item" | "ui"}[],
    elements?: BookCustomElements[]
};

type IPageDirection = IPageFilling & {icon?: string, description: JSONLang};

interface IPageDescription {
    name?: string,

    left?: IPageFilling,
    right?: IPageFilling,

    directions?: {
        first: IPageDirection,
        second?: IPageDirection,
        third?: IPageDirection,
        side?: IBookSide
    },

    section?: string
}
