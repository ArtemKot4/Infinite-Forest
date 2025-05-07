interface IWorkbenchPage {
    type: "workbench",
    description: string,
    pattern: [
        string, 
        string, 
        string
    ], 
    input: Record<string, ItemInstance>,
    result: ItemInstance
}

interface ICauldronPage {
    type: "cauldron",
    description: string,
    input: ItemInstance[],
    result: ItemInstance,
    learnings?: string[],
    reflections?: string[],
    secretCount: number
}

interface IWindmillPage {
    type: "windmill",
    description: string,
    input: ItemInstance[],
    result: ItemInstance,
    learnings?: string[],
    reflections?: string[]
}

interface IRecordPage {
    type: "record",
    title: string,
    subtitle: string,
    description: string
}

interface IDefaultPage {
    type: "default",
    title: string,
    subtitle: string,
    description: string,
    pictures: {
        texture: string,
        y?: number,
        width: number,
        height: number,
        subscription?: string
    }[];
}

type PageDescription = IWorkbenchPage | ICauldronPage | IWindmillPage;
type BookSection = "default" | "feelings" | "workbench" | "cauldron" | "windmill";

class Book {
    public UI: UI.Window = (() => {
        const window = new UI.Window();
        window.setInventoryNeeded(true);
        window.setBlockingBackground(true);
        window.setCloseOnBackPressed(true);
        window.setDynamic(true);
        return window;
    })();

    current: string;
    sections: Record<string, { index: number, pages: PageDescription[] }> = {};

    public getSectionsName(): string[] {
        return Object.keys(this.sections);
    }

    public getLocation(): UI.WindowLocationParams {
        const background = this.getBackground();
        return {
            x: 500 - background.x / 2,
            y: UI.getScreenHeight() / 2 + background.height / 2,
            width: background.width,
            height: background.height
        }
    }

    public getBackground(): UI.UIImageElement {
        const scale = 2;
        return {
            type: "image",
            width: 498 * scale,
            height: 333 * scale,
            bitmap: "book/background.png",
        };
    }

    public synchronize(player: ObjectPlayer): void {
        this.current = this.current || "default";
        this.sections = this.sections || {};

        for(const i in player.learnings) {
            const learning = Learning.get(i);
            if(!(learning.section in this.sections)) {
                this.sections[learning.section] = {
                    index: 0,
                    pages: [
                        //...in future
                    ]
                };
            }
        }
    }

    public getContent(): UI.WindowContent {
        const section = this.sections[this.current];
        if(!section) {
            throw new java.lang.NoSuchFieldException("Section is not defined")
        }

        const content: UI.WindowContent = {
            location: this.getLocation(),
            elements: {
                background: this.getBackground(),
            }
        };
        const left = section.pages[section.index];
        const right = section.pages[section.index + 1] || {};
        
        return content;
    }

    public open(player: ObjectPlayer): void {
        const content = this.getContent();
        this.UI.setContent(content);
        if(!this.UI.isOpened()) this.UI.open();
    }
}