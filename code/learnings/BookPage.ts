interface IPagePosition {
  text: { x: int; y: int };
  title: { x: int; y: int };
  subtitle: { x: int; y: int };
}

class BookPage {
  constructor(public description: IPageDescriptor) {
    const content = BookPage.constructContent(description)
    BookPage.resultPages[description.left.elements.title] =
      {elements: content.elements, drawing: content.drawing};
  }
  public static resultPages: Record<string, {elements: UI.ElementSet, drawing: UI.DrawingSet}> = {};
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
        pos.title.x +
        (translatedTitle.length < 14 ? translatedTitle.length * 4.5 : 0),
      y: pos.title.y,
      text: BookPage.separateText(translatedTitle),
    };
    elements[side + "Subtitle"] = {
      type: "text",
      font: {
        size: 16.5,
        color: android.graphics.Color.parseColor("#194D33"),
      },
      x: pos.subtitle.x,
      y: pos.subtitle.y,
      text: BookPage.separateText(Translation.translate(description.subtitle)),
    };
    elements[side + "Text"] = {
      type: "text",
      font: {
        size: 12.5,
        color: android.graphics.Color.parseColor("#9E9E9E"),
      },
      x: pos.text.x,
      y: pos.text.y,
      text: BookPage.separateText(Translation.translate(description.text)),
      multiline: true,
      clicker: {
        onLongClick(position, container, tileEntity, window, canvas, scale) {
          //TODO: DELETE
          BookUI.UI.content.elements[side + "Text"].x = position.x;
          BookUI.UI.content.elements[side + "Text"].y = position.y;
          BookUI.UI.forceRefresh();
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
          source: {id: parseID(image.texture), count: 1, data: 0}
        };
      }
    }
  }
  public static constructContent(description: IPageDescriptor) {
    const elements = {} as UI.ElementSet;
    const drawing = [] as UI.DrawingSet;
    if (description.left) {
      BookPage.constructText(
        elements,
        description.left.elements,
        {
          title: { x: UI.getScreenHeight() / 1.95, y: 60 },
          subtitle: { x: UI.getScreenHeight() / 1.8, y: 85 },
          text: { x: UI.getScreenHeight() / 1.95, y: 110 },
        },
        "left"
      );
      BookPage.constructImage(
        drawing,
        elements,
        description.left.images,
        UI.getScreenHeight() / 2.7,
        120
      );
    }
    if (description.right) {
      BookPage.constructText(
        elements,
        description.right.elements,
        {
          title: { x: UI.getScreenHeight() * 1.1, y: 60 },
          subtitle: { x: UI.getScreenHeight() * 1.15, y: 85 },
          text: { x: UI.getScreenHeight() * 1.1, y: 110 },
        },
        "right"
      );
      BookPage.constructImage(
        drawing,
        elements,
        description.right.images,
        UI.getScreenHeight(),
        120
      );
    }

    return {elements, drawing};
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
      const content = BookPage.constructContent(takeJSON);
      BookPage.resultPages[takeJSON.left.elements.title] =
        {elements: content.elements, drawing: content.drawing};
    }
    //TODO: description.directions write logic
  }

  static {
    BookPage.readFromJSON();
  }
}
