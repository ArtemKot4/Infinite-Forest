interface IRecipePage {
    name: string,
    title: string,
    subtitle?: string,
    description: string,
    /**
     * id:data | id
     */
    item: string | number
}

interface IWorkbenchPage extends IRecipePage {
    title: string,
    type: "workbench"
}

interface ICauldronPage extends IRecipePage {
    type: "cauldron",
    learnings?: string[],
    reflections?: string[],
    secretCount: number
}

interface IWindmillPage extends IRecipePage {
    type: "windmill",
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
    name: string,
    title: string,
    subtitle: string,
    description: string,
    pictures: {
        bitmap: string,
        y?: number,
        width: number,
        height: number,
        subscription?: string
    }[];
}

type PageDescription = IWorkbenchPage | ICauldronPage | IWindmillPage | IDefaultPage;
type BookSection = "default" | "feelings" | "workbench" | "cauldron" | "windmill";

class Book {
    public static pages: Record<string, PageDescription> = {};
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
            x: 0,
            y: 0,
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
                    pages: []
                };
            }
            this.sections[learning.section].pages.push(Book.pages[learning.pageName]);
        }
    }

    public clear(): void {
        this.UI.setContent({
            location: this.getLocation(),
            drawing: [{
                type: "background",
                color: android.graphics.Color.TRANSPARENT
            }],
            elements: {
                background: this.getBackground()
            }
        });
    }

    public openWith(player: ObjectPlayer): void {
        this.clear();
        this.synchronize(player);
        const left = this.sections[this.current].pages[this.sections[this.current].index];
        const right = this.sections[this.current].pages[this.sections[this.current].index + 1];

        this.drawPage(20, left);
        if(right) {
            this.drawPage((this.getBackground().width / 2) + 20, right)
        }

        this.UI.forceRefresh();

        if(!this.UI.isOpened()) {
            this.UI.open();
        }
    }

    public drawElementsFrom(startX: number, page: PageDescription, elements: UI.ElementSet): void {
        const endX = startX + (this.getBackground().width / 2);

        const newElements: UI.ElementSet = {
            ["title_" + startX]: {
                type: "text",
                text: Translation.translate(page.title),
                x: startX + 20,
                y: 50,
                font: {
                    size: 25,
                    color: android.graphics.Color.GREEN
                }
            }
        }

        let subtitleY = 0;
        if("subtitle" in page) {
            subtitleY = 70;
            newElements["subtitle_" + startX] = {
                type: "text",
                x: startX + 20,
                y: subtitleY,
                text: Translation.translate(page.subtitle),
                font: {
                    size: 22.5,
                    color: android.graphics.Color.GRAY
                }
            }
        }

        newElements["description_" + startX] = {
            type: "text",
            x: startX + 20,
            y: subtitleY + 30,
            width: this.getBackground().width,
            height: 200,
            text: Translation.translate(page.description),
            font: {
                size: 20,
                color: android.graphics.Color.LTGRAY
            },
            multiline: true
        }

        for(const i in elements) {
            const element = {...elements[i]};
            if(element.x > endX) {
                element.x = Math.min(endX, (Math.max(startX, endX - element.width || 0)));
            }
            const textRows = elements.description.text.split("").length / 30;
            if(element.y >= subtitleY + 30 * textRows) {
                element.y = (subtitleY + 30 * textRows) + 10;
            }
            newElements.elements[i] = element;
        }

        const lastContent = this.UI.getContent();

        this.UI.setContent({...lastContent, ...{
            elements: {...lastContent.elements, ...newElements}
        }});
    }

    public drawCauldronPage(startX: number, page: ICauldronPage): void {
        
    }

    public drawDefaultPage(startX: number, page: IDefaultPage): void {
        const elements: Record<string, UI.UIImageElement> = {};
        let y = 100 + (10 * (Translation.translate(page.description).split("").length / 30));
        for(const i in page.pictures) {
            const picture = page.pictures[i];
            const element: UI.UIImageElement = {
                type: "image",
                x: startX + 20,
                y: y,
                width: picture.width,
                height: picture.height,
                bitmap: picture.bitmap
            }
            elements["picture_" + i] = element;
            y += 10; //+ picture.height;
        }
        this.drawElementsFrom(startX, page, elements);
    }

    public drawWindmillPage(startX: number, page: IWindmillPage): void {

    }

    public drawPage(startX: number, page: PageDescription): void {
        switch(page.type) {
            case "default": {
                return this.drawDefaultPage(startX, page);
            }
            case "cauldron": {
                return this.drawCauldronPage(startX, page);
            }
            case "windmill": {
                return this.drawWindmillPage(startX, page);
            }
        }
        throw new java.lang.NoSuchFieldException(`Page type "${page.type}" is not defined`);
    }

    public static registerPage(page: PageDescription): void {
        this.pages[page.name] = page;
    }

    public static registerPagesFromPath(path: string): void {
        const files = FileTools.GetListOfFiles(path, "");
        for(const i in files) {
            const object: PageDescription = JSON.parse(FileTools.ReadText(files[i].getAbsolutePath()));
            if("title" in object) {
                object.type = object.type || "default";
                this.pages[object.name] = object;
            }
        }
    }
}

Book.registerPagesFromPath(__dir__ + "resources/assets/pages")

/*
     "left": {
      "title": {
        "text": {
          "en": "Time is come",
          "ru": "Время пришло"
        }
      },
      "subtitle": {
        "text": {
          "en": "Strange feel",
          "ru": "Странное чувство"
        }
      },
      "text": {
        "text": {
          "en": "A now day, and... Again i'm trying run away from strange dream, that from old days worrying my. There i'm walks in mystical forest. A highest trees, which crowns grows and spreads in wide skies, couldn't me feeling free myself. Quit wind of leaves, so cold dirt, in there leaves has been break down and flowers, come back to me my fears. Time is come to equal my problem, since at day I'm starting write my diary...",
          "ru": "Сейчас день, и... В очередной раз я пытаюсь убежать от странного сна, что давно меня беспокоит. В нём я брёл по загадочному лесу. Высочайшие деревья, чьи кроны углублялись и теснились глубоко в небе, не дают мне покоя. Тихий шёпот листьев, прохладная земля, на которой были броско разбросаны листья и цветы, бросают меня в дрожь. Пора разобраться со своими проблемами. С этого дня начинаю вести дневник..."
        }
      }
  },
  "right": {
      "title": {
        "text": {
          "en": "First step",
          "ru": "Первый шаг"
        }
      },
      "text": {
        "text": {
          "en": "Hmm... from what me should start? Would be nice a digging in a mine",
          "ru": "Хмм... с чего бы мне начать? Было бы неплохо покопаться в шахте"
        }
      },
      "pictures": [
        {
          "x": 5,
          "y": 85,
          "scale": 3.5,
          "texture": "crystal_cave_painting"
        }
     ]
  }
*/