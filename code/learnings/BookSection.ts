namespace Book {
  export class Section {
    public static list: Record<name, { texture: string[]; icon: string }> = {};

    public static current: keyof ISectionList = "default";

    constructor(
      public name: keyof ISectionList,
      public icon: string,
      public texture: string[] = ["book.default_section", "book.default_section_larged"]
    ) {
      Section.list[name] = { texture, icon };
    }

    public givePage(player: int, page: name, sign: string | string[]) {
      IdeaUI.initAnimation(sign);
      (GraphicUI.pagesList[Entity.getNameTag(player)][this.name].pages ??=
        []).push(page);
    }

    public static givePage(
      player: int,
      page: name,
      section: keyof ISectionList,
      sign: string | string[]
    ) {
      IdeaUI.initAnimation(sign);
      (GraphicUI.pagesList[Entity.getNameTag(player)][section].pages ??=
        []).push(page);
    }

    public static grawSectionButton(section: keyof ISectionList, y: int) {
      const textureList = Section.list[section];

      const clicker = {
        clicker: {
          onClick(position, container) {
            Section.setCurrent(section);

            GraphicUI.openFor(Player.getLocal());

            alert("Раздел: -> " + section);
          },
        },
      };

      GraphicUI.UI.content.elements[section + "_tab"] = {
        type: "image",
        x: UI.getScreenHeight() - 275,
        y: y,
        bitmap: textureList.texture[0],
        scale: 1.3,
        ...clicker,
      };

      GraphicUI.UI.content.elements[section + "_tab_icon"] = {
        type: "image",
        x: UI.getScreenHeight() - 278,
        y: y + 5,
        bitmap: textureList.icon,
        scale: 1.5,
        ...clicker,
      };

      GraphicUI.UI.forceRefresh();
    }

    public static initSectionButtons(playerName: string) {
      let data = (GraphicUI.pagesList[playerName] ??= {} as ISectionList);
      let distanceY = 110;

      for (const section of Object.keys(Section.list)) {
        const elementList = Object.values(GraphicUI.UI.content.elements);

        if (data[section as keyof ISectionList].pages.length > 0) {

          const last = []
            .concat(elementList)
            .reverse()
            .find((v) => String(v.bitmap as string).endsWith("tab")); 

          const coords = (last?.y || distanceY + last.y);

          Section.grawSectionButton(
            section as keyof ISectionList,
            coords
          );
        }
      }
    };

    public static setCurrent(section: keyof ISectionList) {
        Section.current = section;
    };

    public static getCurrent() {
      return Section.current;
    };

  }

  export const DefaultSection = new Section("default", "book.glowworm");
  export const CauldronSection = new Section(
    "cauldron",
    "book.cauldron_tab"
  );
  export const SignSection = new Section("sign", "book.left_button");
}