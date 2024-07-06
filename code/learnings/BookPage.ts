class BookPage {
  constructor(text: string) {}
  public static resultPages = [];
  public static readFromJSON() {
    const DIRS = FileTools.GetListOfFiles(__dir__ + "resources/pages/", "");
    for (const dir of DIRS) {
      const takeJSON = JSON.parse(FileTools.ReadText(dir.getAbsolutePath()));
      for (const k in takeJSON) {
        const description = takeJSON[k] as IPageDescriptor;
        const elements = {} as UI.ElementSet;
        elements[description.title] = {
          type: "text",
          x: UI.getScreenHeight() * 0.75 + 10,
          y: 10,
          text: description.title,
        };
        if (description.subtitle) {
          elements[description.subtitle] = {
            type: "text",
            x: UI.getScreenHeight() * 0.75 + 15,
            y: 20,
            font: {
              size: 15,
            },
            text: description.subtitle,
          };
        }
        if (description.images) {
          for (const image of description.images) {
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
        };
        //TODO: description.directions write logic
        BookPage.resultPages.push({elements: elements});
      }
    }
  }
}
