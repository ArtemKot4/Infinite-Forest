class Tag {
  public group: TagRegistry.TagGroup<int | int[]>;
  constructor(name: string) {
    this.group = TagRegistry.getOrCreateGroup<int>(name);
  }
  public add(id: int, ...tags: string[]) {
    this.group.addCommonObject(id, ...tags || "");
  };
  public get(tags: string[]) {
    return this.group.getAllWhere(() => true);
  }
}

namespace Tags {
    export const Candle = new Tag("candle");
    Candle.add(ELightCandles.none.getID(), 'block');
}