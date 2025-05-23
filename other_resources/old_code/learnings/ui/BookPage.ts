namespace Book {
  export interface IPagePosition {
    text: int;
    title: int;
    subtitle: int;
  }

  export interface resultPageDescriptor {
    elements: UI.ElementSet;
    drawing: UI.DrawingSet;
    directions?: pageDirection;
  }

  export class Page {

    constructor(public description: IPageDescriptor) {
      const content = Page.constructContent(description);

      Page.resultPages[description.left.elements.title] = {
        elements: content.elements,
        drawing: content.drawing,
        ...description.directions && {directions: description.directions}
      };
    }

    public static resultPages: Record<string, resultPageDescriptor> = {};

    public static separateText(text: string) {
      let result = "";
      for (let i = 0; i < text.length; i++) {
        result += text[i];
        if ((i + 1) % 25 === 0) {
          result += result[i] === " " ? "\n" : "-\n";
        }
      }
      return result;
    }

    public static constructText(
      elements: UI.ElementSet,
      description: pageElements,
      pos: IPagePosition,
      side: "left" | "right"
    ) {
      if (!description) return;

      const translatedTitle = Translation.translate(description.title);

      elements[side + "Title"] = {
        type: "text",
        font: {
          size: 20,
          color: android.graphics.Color.parseColor("#00A416"),
        },
        x:
          pos.title +
          (translatedTitle.length < 14 ? translatedTitle.length * 4.5 : 0),
        y: 60,
        text: Page.separateText(translatedTitle),
      };

      elements[side + "Subtitle"] = {
        type: "text",
        font: {
          size: 16.5,
          color: android.graphics.Color.parseColor("#194D33"),
        },
        x: pos.subtitle,
        y: 85,
        text: Page.separateText(Translation.translate(description.subtitle)),
      };

      elements[side + "Text"] = {
        type: "text",
        font: {
          size: 12.5,
          color: android.graphics.Color.parseColor("#9E9E9E"),
        },
        x: pos.text,
        y: 110,
        text: Page.separateText(Translation.translate(description.text)),
        multiline: true,
        clicker: {
          onLongClick(position, container, tileEntity, window, canvas, scale) {
            const UI = MainUI.getUI();

            UI.content.elements[side + "Text"].x = position.x;
            UI.content.elements[side + "Text"].y = position.y;

            UI.forceRefresh();
            //TODO: IT IS TEST, DELETE IF IS NOT VALID
          },
        },
      };
    }

    public static constructImage(
      drawing: UI.DrawingSet,
      elements: UI.ElementSet,
      images: pageImage[],
      defaultX: int,
      defaultY: int
    ) {
      if (!images) return;
      for (const image of images) {
        if (image.type === "default") {
          drawing.push({
            type: "bitmap",
            x: defaultX + image.x,
            y: defaultY + image.y,
            scale: image.scale,
            bitmap: `book.${image.texture}`,
          });
        } else {
          elements[image.texture] = {
            type: "slot",
            x: defaultX + image.x,
            y: defaultY + image.y,
            scale: image.scale,
            bitmap: "unknown",
            visual: true,
            source: {
              id: ForestUtils.parseID(image.texture),
              count: 1,
              data: 0,
            },
          };
        }
      }
    }
    public static constructContent(description: IPageDescriptor) {
      const elements = {} as UI.ElementSet;
      const drawing = [] as UI.DrawingSet;
      if (description.left) {
        Page.constructText(
          elements,
          description.left.elements,
          {
            title: UI.getScreenHeight() / 1.95,
            subtitle: UI.getScreenHeight() / 1.8,
            text: UI.getScreenHeight() / 1.95,
          },
          "left"
        );
        Page.constructImage(
          drawing,
          elements,
          description.left.images,
          UI.getScreenHeight() / 2.7,
          120
        );
      }
      if (description.right) {
        Page.constructText(
          elements,
          description.right.elements,
          {
            title: UI.getScreenHeight() * 1.1,
            subtitle: UI.getScreenHeight() * 1.15,
            text: UI.getScreenHeight() * 1.1,
          },
          "right"
        );
        Page.constructImage(
          drawing,
          elements,
          description.right.images,
          UI.getScreenHeight(),
          120
        );
      }

      return { elements, drawing };
    }

    public static constructDirection(x: int, y: int, image: int) {
      const onClick = function () {};
    }

    public static readFromJSON() {
      const DIRS = FileTools.GetListOfFiles(
        __dir__ + "resources/assets/pages/",
        ""
      );
      for (const dir of DIRS) {
        const takeJSON = JSON.parse(
          FileTools.ReadText(dir.getAbsolutePath())
        ) as IPageDescriptor;

        const content = Page.constructContent(takeJSON);

        Page.resultPages[takeJSON.left.elements.title] = Object.assign(
          { elements: content.elements, drawing: content.drawing },
          takeJSON.directions && { directions: takeJSON.directions }
        );
      }
    }

    public static getPage(name: string): Nullable<resultPageDescriptor> {
      return Page.resultPages[name] || null;
    }

    static {
      Page.readFromJSON();
    }
  }
}
