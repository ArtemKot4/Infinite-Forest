namespace Cauldron {

  export const WATER_HEIGHT_MAX = 1.1;
  export const WATER_HEIGHT_MIN = 0.4;
  export const WATER_LEVELS_MAX = 7;

  const waterMesh = (() => {
    const mesh = new RenderMesh();

    mesh.addVertex(-6 / 16, 0, -6 / 16, 0, 0);
    mesh.addVertex(6 / 16, 0, -6 / 16, 1, 0);
    mesh.addVertex(-6 / 16, 0, 6 / 16, 0, 1);

    mesh.addVertex(6 / 16, 0, -6 / 16, 1, 0);
    mesh.addVertex(-6 / 16, 0, 6 / 16, 0, 1);
    mesh.addVertex(6 / 16, 0, 6 / 16, 1, 1);

    return mesh;
  })();

  export function createWaterOverlay(tile: TileEntityBase & {waterAnimation: Animation.Base}, height?: int) {
    const description = {
      mesh: waterMesh,
      skin: "terrain-atlas/water/water_0.png",
    };

    if (tile.waterAnimation?.exists()) {
      tile.waterAnimation.describe(description);

      tile.waterAnimation.refresh();
    } else {
      tile.waterAnimation = new Animation.Base(this.x + 0.5, this.y + WATER_HEIGHT_MIN + Number("0." + height), this.z + 0.5);
      height && tile.waterAnimation.setPos(this.x + 0.5, this.y + WATER_HEIGHT_MIN + Number("0." + height), this.z + 0.5)
      tile.waterAnimation.describe(description);

      tile.waterAnimation.load();
    }

    return;
  }

  export class Tile extends TileEntityBase {
    public waterAnimation: Animation.Base;
    public data: { water: int; boiling: boolean };

    @NetworkEvent(Side.Client)
    public createWaterAnimation(data: {count: int}) {
      Game.message("Я отправился!");

      return createWaterOverlay(this, data.count || WATER_HEIGHT_MAX);
    }

    @NetworkEvent(Side.Client)
    public describeWaterAnimation(data: { skin: string; height?: int }) {
      if (this.waterAnimation?.exists()) {

        if (data.height) {
          this.waterAnimation.setPos(this.x + 0.5, this.y + WATER_HEIGHT_MIN + (Number("0." + data.height) || 0), this.z + 0.5);
        }
        
        this.waterAnimation.describe({ mesh: waterMesh, ...data.skin && ({skin: data.skin })});

        this.waterAnimation.refresh();
        return;
      }
    }

    public setWaterCount(count: int) {
      if (!!count === true) {
        this.sendPacket("createWaterAnimation", {height: count});
      } else {
        this.sendPacket("describeWaterAnimation", {
          skin: "terrain-atlas/unknown.png",
        });
      }

      this.data.water = count;
      this.networkData.putInt("water", count);
    }

    public takeWater(emptyItem: LiquidItemRegistry.EmptyData) {
      if (emptyItem.liquid === "water" && !!this.data.water) {
        this.setWaterCount(0);
      }
    }

    public onItemUse(
      coords: Callback.ItemUseCoordinates,
      item: ItemStack,
      player: number
    ) {
      Game.message("Я работаю!");

      const fullItem = LiquidItemRegistry.getFullItem(
        item.id,
        item.data,
        "water"
      );
      const emptyItem = LiquidItemRegistry.getEmptyItem(item.id, item.data);

      const entity = new PlayerEntity(player);

      if (fullItem) {
        entity.setCarriedItem({
          id: emptyItem.id,
          count: 1,
          data: emptyItem.data,
        });

        this.setWaterCount(WATER_LEVELS_MAX);
        return;
      };
      this.takeWater(emptyItem);
      return;
    }

    public clientLoad(): void {
      if (this.networkData.getInt("water", 0)) {
        this.sendPacket("createWaterAnimation", {});
      }
    };

    public clientUnload(): void {
      this.waterAnimation && this.waterAnimation.destroy();
    }
  }

  export const block: FBlock = new FBlock("iron_cauldron", [
    {
      name: "Iron cauldron",
      texture: [["iron_cauldron", 0]],
      inCreative: true,
    },
  ])
    .createWithRotation()
    .setupBlockModel({ model: "block/iron_cauldron", texture: "iron_cauldron" })
    .setDestroyLevel(MiningLevel.STONE)
    .setTile(new Tile());
}
