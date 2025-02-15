interface IBookImageElement extends UI.UIClickEvent {
    x: number,
    y: number,
    type: "image" | "item";
    image: string;
    scale?: number;
    size?: number;
    clicker: UI.UIClickEvent;
};

interface IBookTextElement extends UI.UIClickEvent {
    x: number;
    y: number;
    font?: UI.FontDescription;
    text?: string;
    line_size?: number;
};

interface IBookButtonElement extends UI.UIClickEvent {
    x: number;
    y: number;
    scale?: number;
    bitmap?: com.zhekasmirnov.innercore.api.mod.ui.elements.BitmapTypes;
    bitmap2?: com.zhekasmirnov.innercore.api.mod.ui.elements.BitmapTypes;
};

class PageUI {
    public UI: UI.Window = new UI.Window();

    public defaultContent = {
        drawing: [{
            type: "background",
            color: android.graphics.Color.argb(0, 0, 0, 0)
        }],
        elements: {},
        location: {},
        params: {},
        style: {}
    } as UI.WindowContent;
    
    public getDefaultContent(): UI.WindowContent {
        return {...this.defaultContent};
    };

    public setWidth(width: number): this {
        this.defaultContent.location.width = width;
        return this;
    };

    public setHeight(height: number): this {
        this.defaultContent.location.height = height;
        return this;
    };

    public setPosition(x: number, y: number): this {
        this.defaultContent.location.x = x;
        this.defaultContent.location.y = y;
        return this;
    };

    public setTextElement(element_name: string, description: IBookTextElement): this {
        this.defaultContent.elements[element_name] = {
            type: "text",
            x: description.x,
            y: description.y,
            multiline: true,
            text: UIHelper.separateText(Translation.translate(description.text), description.line_size || 25),
            font: {
                size: 20,
                color: android.graphics.Color.BLACK,
                ...description.font
            },
            clicker: {
                onClick: description.onClick,
                onLongClick: description.onLongClick
            }
        } satisfies UI.UITextElement;
        return this;
    };

    public setImageElement(element_name: string, description: IBookImageElement): this {
        let content = {
            x: description.x,
            y: description.y,
            clicker: {
                onClick: description.onClick,
                onLongClick: description.onLongClick
            }
        } as UI.UIImageElement | UI.UISlotElement;

        if(description.type === "image") {
            content.type = "image";
            content.scale = description.scale;
            content.image = description.image;
        } else {
            content.type = "slot";
            content.size = description.size;
            content.item = parseID(description.image);
        };
            
        this.defaultContent.elements[element_name] = content;
        return this;
    };

    public setButtonElement(element_name: string, description: IBookButtonElement): this {
        this.defaultContent.elements[element_name] = {
            type: "button",
            x: description.x,
            y: description.y,
            bitmap: description.bitmap,
            bitmap2: description.bitmap2,
            scale: description.scale,
            clicker: {
                onClick: description.onClick,
                onLongClick: description.onLongClick
            }
        } satisfies UI.UIButtonElement;
        return this;
    };

    public open(): this {
        if(this.onOpen) this.onOpen((this));

        this.UI.open();

        if(this.customRender) {
            this.customRender(this);
        } else {
            this.defaultRender();
        };

        this.UI.forceRefresh();

        return this;
    };

    public close(): void {
        this.UI.close();
        if(this.onClose) this.onClose((this));
    };

    protected onOpen!: (page: this) => void;
    protected onClose!: (page: this) => void;
    protected customRender!: (page: this) => void;

    public setOpenAction(callback: typeof this.onOpen) {
        this.onOpen = callback;
        return this;
    };

    public setCloseAction(callback: typeof this.onClose) {
        this.onClose = callback;
        return this;
    };

    protected defaultRender(): void {
        this.UI.setContent(this.getDefaultContent());
    };

    public setCustomRendering(callback: typeof this.customRender): this {
        this.customRender = callback;
        return this;
    };

    public clear(): this {
        this.defaultContent.elements = {};
        return this; 
    }
};

abstract class Book {
    protected backgroundUI: UI.Window = new UI.Window();
    protected background_bitmap: android.graphics.Bitmap;
    protected scale: number;

    protected leftPageUI: PageUI
    protected rightPageUI: PageUI

    protected getLeftPageUI(): PageUI {
        return new PageUI();
    };

    protected getRightPageUI(): PageUI {
        return new PageUI();
    };

    public constructor(background_icon: string, scale: number) {
        this.background_bitmap = TextureSource.get(background_icon);
        this.scale = scale;

        const width = this.background_bitmap.getWidth();
        const height = this.background_bitmap.getHeight();

        const defaultX = UI.getScreenHeight() * 1.1 - ((width * scale) / 2);
        const defaultY = UI.getScreenHeight() / 2 - ((height * scale) / 2);

        this.leftPageUI = this.getLeftPageUI()
        .setWidth((width * scale) / 2)
        .setHeight(height * scale)
        .setPosition(defaultX, defaultY);

        this.rightPageUI = this.getRightPageUI()
        .setWidth((width * scale) / 2)
        .setHeight(height * scale)
        .setPosition((UI.getScreenHeight() / 2), defaultY);

        this.backgroundUI.setContent({
            location: {
                width: width * scale,
                height: height * scale,
                x: defaultX,
                y: defaultY
            },
            drawing: [{
                type: "background",
                color: android.graphics.Color.argb(0, 0, 0, 0)
            }, {
                type: "bitmap",
                bitmap: background_icon,
                width: width * scale,
                height: height * scale
            }]
        });

        //debug start
        this.backgroundUI.setCloseOnBackPressed(true);
        this.leftPageUI.UI.setCloseOnBackPressed(true);
        this.rightPageUI.UI.setCloseOnBackPressed(true);
        //debug end
    };

    public open(): void {
        this.backgroundUI.open();
        this.leftPageUI.open();
        this.rightPageUI.open();

        this.backgroundUI.forceRefresh();
        Game.message(this.background_bitmap.getWidth() + " | " + this.background_bitmap.getHeight());
        return;
    };

    public close(): void {
        this.backgroundUI.close();
        this.leftPageUI.UI.close();
        this.rightPageUI.UI.close();
    };
};


class TestBook extends Book {
    public override getLeftPageUI = () => new PageUI()
    .setTextElement("aboba", {
        text: "aboba",
        x: 10,
        y: 10
    }).setTextElement("aboba2", {
        text: "aboba2",
        x: 10,
        y: 20,
    });

    public override getRightPageUI = () => new PageUI()
    .setTextElement("aboba3", {
        text: "aboba3",
        x: 10,
        y: 10
    })
    .setTextElement("aboba4", {
        text: "aboba4",
        x: 10,
        y: 20,
    });
};

