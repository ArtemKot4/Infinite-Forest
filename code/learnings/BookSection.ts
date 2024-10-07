namespace Book {
  export class Section {
    public static list: Record<name, { texture: string; icon: string }> = {};

   public static eachPositions: Record<name, int> = {};


    constructor(
      public name: keyof ISectionList,
      public icon: string,
      public texture = "book.default_section"
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
            currentSection = section;

            GraphicUI.openFor(Player.getLocal());

            alert("Раздел: -> " + section);
          },
        },
      };

      GraphicUI.UI.content.elements[section + "_tab"] = {
        type: "image",
        x: UI.getScreenHeight() - 275,
        y: y,
        bitmap: textureList.texture,
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

               const last = elementList.findLast((v) => (v.bitmap as string).endsWith("tab")) //! ->
               //! -> Эта функция даёт ошибку

             if(last) {
              this.eachPositions[section] ??= distanceY + last.y;
             }
          

          Section.grawSectionButton(section as keyof ISectionList, this.eachPositions[section]);
        }
      }
    }
  }

  export const DefaultSection = new Section("default", "book.glowworm");
  export const CauldronSection = new Section(
    "cauldron",
    "book.left_button_pressed"
  );
  export const SignSection = new Section("sign", "book.left_button");
}
