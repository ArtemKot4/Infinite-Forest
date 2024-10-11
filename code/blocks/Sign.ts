
namespace Sign {
  export const list: Record<string, int> = {
    crystal: 1,
    snow: 2,
    fire: 3,
    forest: 4,
    question: 5,
  };

  export const block = (() => {
    const textureList = ["unknown"]
      .concat(Object.keys(list))
      .map((v) => "sign_".concat(v));

    const content = textureList.map((v, i, a) => {
      return {
        name: "block.infinite_forest.sign",
        texture: [[textureList[i], 0]] as [string, number][],
        inCreative: true,
      };
    });

    const block = new DungeonBlock("stone_sign", content, "stone");
    block.create();
    return block;
  })();

  export class Tile extends TileEntityBase {
    animation: Animation.Item;
    public clientLoad(): void {
      if (this.animation && this.animation instanceof Animation.Item) {
        this.animation.loadCustom(() => {
          this.animation.transform().lock().translate(0, 0, 0.01).unlock();
        });
      }
    }
    public clientUnload(): void {
      if (this.animation) {
        this.animation.destroy();
      }
    }
    @BlockEngine.Decorators.NetworkEvent(Side.Client)
    public releaseAnimation(data: { item: ItemStack }) {
      const animation = (this.animation = new Animation.Item(
        this.x + 0.5,
        this.y + 1.1,
        this.z + 0.5
      ));

      animation.describeItem({
        id: data.item.id,
        count: data.item.count,
        data: data.item.data,
        size: 0.4,
        rotation: [Math.PI / 2, 0, 0],
      });

      animation.loadCustom(() => {
        animation.transform().lock().translate(0, 0, 0.01).unlock();
      });
    }

    public verifyCandleCondition() {
      const validHeight = this.y + 1;

      const xzCoordsList = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];

      const candleCountForEach = xzCoordsList.map((v, i) =>
        Candle.getCount(this.region, new Vector3(v[0], validHeight, v[1]))
      );

    Game.message("Candle count: -> " + JSON.stringify(candleCountForEach));

    const trueCondition = candleCountForEach.some((v, i) => v > 1 && 
    candleCountForEach.find((v, newI) => i !== newI && candleCountForEach[i] !== v)
    );

      if(trueCondition) {
        Game.message("Условие правильно") 
        return;

      } else {

        Game.message("условие не правильно")
      }
    };

    onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number) {
        return this.verifyCandleCondition();
    }
  };

  TileEntity.registerPrototype(block.getID(), new Tile());
}

Translation.addTranslation("block.infinite_forest.sign", {
  en: "Stone sign",
  ru: "Каменный знак",
});
