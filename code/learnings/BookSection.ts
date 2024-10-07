namespace Book {

export class Section {
    public static list: Record<name, {texture: string, icon: string}> = {};

    constructor(public name: keyof ISectionList, public icon: string, public texture = "book.default_section") {
      Section.list[name] = {texture, icon};
      
    };

    public givePage(player: int, page: name, sign: string | string[]) {
        IdeaUI.initAnimation(sign);
        (GraphicUI.pagesList[Entity.getNameTag(player)][this.name].pages ??= []).push(page);
      }

      public static givePage(player: int, page: name, section: keyof ISectionList, sign: string | string[]) {
        IdeaUI.initAnimation(sign);
        (GraphicUI.pagesList[Entity.getNameTag(player)][section].pages ??= []).push(page);
      };

      public static grawSectionButton(section: keyof ISectionList, y: int) {
        const textureList = Section.list[section];

       const clicker =  {clicker: {
        onClick(position, container) {
          currentSection = section;

          GraphicUI.openFor(Player.getLocal());

          alert("Раздел: -> " + section)
        }
      }}

          GraphicUI.UI.content.elements[section + "_tab"] = {
            "type": "image",
            x: UI.getScreenHeight() - 280,
            y: y,
            bitmap: textureList.texture,
           ...clicker
          };

          GraphicUI.UI.content.elements[section + "_tab_icon"] = {
            "type": "image",
            x: UI.getScreenHeight() - 280,
            y: y + 5,
            bitmap: textureList.texture,
            ...clicker
          };

          GraphicUI.UI.forceRefresh();
      };

      public static initSectionButtons(playerName: string) {
        let data = GraphicUI.pagesList[playerName] ??= {} as ISectionList;
        let endY = 90;

        for(const section of Object.keys(Section.list)) { 

         if(data[section as keyof ISectionList].pages.length > 0) {
          
              for(const index in GraphicUI.UI.content.elements) {

                const element = GraphicUI.UI.content.elements[index];

                if(index.startsWith(section + "_tab")) {
                   endY = element.y + 50;
                }
              };

            const textureList = Section.list[section];

              Section.grawSectionButton(section as keyof ISectionList, endY)
         }
        }
      }
};

export const DefaultSection = new Section("default", "book.glowworm");
export const CauldronSection = new Section("cauldron", "book.cauldron_section");
export const SignSection = new Section("sign", "book.sign_sectin");



}