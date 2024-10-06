namespace Book {

export class Section {
    public static list: Record<name, {texture: string, icon: string}> = {};

    constructor(public name: keyof ISectionList, public icon: string, public texture = "book.section_default") {
      Section.list[name] = {texture, icon};
      
    };

    public givePage(player: int, page: name, sign: string | string[]) {
        IdeaUI.initAnimation(sign);
        (GraphicUI.pagesList[Entity.getNameTag(player)][this.name].pages ??= ["main_title"]).push(page);
      }

      public static givePage(player: int, page: name, section: keyof ISectionList, sign: string | string[]) {
        IdeaUI.initAnimation(sign);
        (GraphicUI.pagesList[Entity.getNameTag(player)][section].pages ??= ["main_title"]).push(page);
      }
};

export const DefaultSection = new Section("default", "book.glowworm");
export const CauldronSection = new Section("cauldron", "book.cauldron_section");
export const SignSection = new Section("sign", "book.sign_sectin");



}