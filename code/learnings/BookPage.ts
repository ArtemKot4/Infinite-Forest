interface IPagePosition {
  text: { x: int; y: int };
  title: { x: int; y: int };
  subtitle: { x: int; y: int };
}

class BookPage {
  constructor(public description: IPageDescriptor) {
    BookPage.resultPages[description.left.elements.title] =
      BookPage.constructElementList(description);
  }
  public static resultPages: Record<string, UI.ElementSet> = {};
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
    const translatedTitle = Translation.translate(description.title);
    elements[side + "Title"] = {
      type: "text",
      font: {
        size: 20,
        color: android.graphics.Color.parseColor("#00A416"),
      },
      x:
        pos.title.x +
        (translatedTitle.length < 8 ? translatedTitle.length * 2.5 : 0),
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
        onLongClick(position, container, tileEntity, window, canvas, scale) { //TODO: DELETE
           BookUI.UI.content.elements[side + "Text"].x = position.x;
           BookUI.UI.content.elements[side + "Text"].y = position.y;
           BookUI.UI.forceRefresh();
      }
    }
  }
}
  public static constructElementList(description: IPageDescriptor) {
    const elements = {} as UI.ElementSet;
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
    BookPage.constructImage(elements, description.left.images);
    BookPage.constructImage(elements, description.right.images);
    return elements;
  }
  public static constructImage(elements: UI.ElementSet, images: pageImage[]) {
    if (images) {
      for (const image of images) {
        alert(JSON.stringify(image));
        if (image.type === "default") {
          elements[image.texture] = {
            type: "image",
            x: image.x,
            y: 200 + image.y,
            bitmap: image.texture,
            scale: image.scale,
          };
        } else {
          const id =
            ItemID[image.texture] ??
            VanillaItemID[image.texture] ??
            VanillaBlockID[image.texture] ??
            BlockID[image.texture];

          elements[image.texture] = {
            type: "slot",
            x: image.x,
            y: 200 + image.y,
            bitmap: "unknown",
            scale: image.scale,
            visual: true,
            source: { id: id, count: 1, data: 0 },
          };
        }
      }
    }
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
      BookPage.resultPages[takeJSON.left.elements.title] =
        BookPage.constructElementList(takeJSON);
    }
    //TODO: description.directions write logic
  }

  static {
    BookPage.readFromJSON();
  }
}
