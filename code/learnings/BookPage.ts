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
      if ((i + 1) % 60 === 0) {
        result += "\n";
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
    elements[side + "Title"] = {
      type: "text",
      font: {
        size: 30,
      },
      x: pos.title.x,
      y: pos.title.y,
      text: BookPage.separateText(Translation.translate(description.title)),
    };
    elements[side + "Subtitle"] = {
      type: "text",
      font: {
        size: 22.5,
      },
      x: pos.subtitle.x,
      y: pos.subtitle.y,
      text: BookPage.separateText(Translation.translate(description.subtitle)),
    };
    elements[side + "Text"] = {
      type: "text",
      font: {
        size: 15,
      },
      x: pos.text.x,
      y: pos.text.y,
      text: BookPage.separateText(Translation.translate(description.text)),
    };
  }
  public static constructElementList(description: IPageDescriptor) {
    const elements = {} as UI.ElementSet;
    BookPage.constructText(
      elements,
      description.left.elements,
      {
        title: { x: UI.getScreenHeight() / 3.5, y: 10 },
        subtitle: { x: UI.getScreenHeight() / 3.25, y: 25 },
        text: { x: UI.getScreenHeight() / 3.5, y: 35 },
      },
      "left"
    );

    BookPage.constructText(
      elements,
      description.left.elements,
      {
        title: { x: UI.getScreenHeight() / 2.5, y: 10 },
        subtitle: { x: UI.getScreenHeight() / 2.25, y: 25 },
        text: { x: UI.getScreenHeight() / 2.5, y: 35 },
      },
      "left"
    );
    BookPage.constructImage(elements, description.left.images);
    BookPage.constructImage(elements, description.right.images);
    return elements;
  }
  public static constructImage(elements: UI.ElementSet, images: pageImage[]) {
    if (images) {
      for (const image of images) {
        if (image.type === "default") {
          elements[image.texture] = {
            type: "image",
            x: UI.getScreenHeight() * 0.75 + image.x,
            y: 20 + image.y,
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
            x: UI.getScreenHeight() * 0.75 + image.x,
            y: 20 + image.y,
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
      const takeJSON = JSON.parse(FileTools.ReadText(dir.getAbsolutePath())) as IPageDescriptor;
      alert(JSON.stringify(takeJSON));
      BookPage.resultPages[takeJSON.left.elements.title] =
      BookPage.constructElementList(takeJSON);
    }
    //TODO: description.directions write logic
  };

  static {
    BookPage.readFromJSON();
  };
  
}
