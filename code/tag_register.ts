class Tag {
  public group: TagRegistry.TagGroup<int | int[]>;
  constructor(name: string) {
    this.group = TagRegistry.getOrCreateGroup<int>(name);
  }
  public addItem(id: int, tags?: string[]) {
    this.group.addCommonObject(id, ...tags);
  }
  public addBlock(id: int, tags?: string[]): void;
  public addBlock(id: int, data: int): void;
  public addBlock(id: int, data: int, tags?: string[]): void;
  public addBlock(id: int, data: int | string[], tags?: string[]) {
    let obj: any = id;

    if (Array.isArray(data)) {

      this.group.addCommonObject(obj, ...data);

    } else {

      if (data) {
        obj = [id, data];
      };

      this.group.addCommonObject(obj, ...tags);
    }
  }
}

namespace Tags {
    export const Candle = new Tag("candle");
    Candle.addBlock(ELightCandles.none.getID());
}