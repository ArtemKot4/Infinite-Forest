class DungeonDoor {
  public filler: FBlock;
  public locker: FBlock;
  constructor(filler: string, locker: string, public key: DungeonKey) {
    this.filler = new FBlock(filler, [
      {
        name: `block.infinite_forest.${filler}`,
        texture: [
          [locker, 0],
          [locker, 0],
          [locker, 0],
          [filler, 0],
          [locker, 0],
          [locker, 0],
        ],
        inCreative: true //TODO: false,
      },
    ]).createWithRotation();
    this.locker = new FBlock(locker, [
      {
        name: `block.infinite_forest.${locker}`,
        texture: [[locker, 0]],
        inCreative: true //TODO: false,
      },
    ]).create();
    Block.registerClickFunctionForID(
      this.locker.getID(),
      this.onClick.bind(this)
    );
    ConnectedTexture.setModel(this.filler.getID(), -1, filler);
    DungeonBlock.addToDungeonList(this.filler.getID());
    DungeonBlock.addToDungeonList(this.locker.getID());
  };
  openIfValid(coords: Vector[], region: BlockSource, item: ItemInstance, player: int) {
    for(let coord of coords) {
        if(region.getBlockId(coord.x, coord.y, coord.z) !== this.filler.getID()) {
            Game.message(JSON.stringify(coord));
          return;
        }
    };
  
    this.key.setLock(item, player);
    alert("open")
    for(let coord of coords) {
        region.setBlock(coord.x, coord.y, coord.z, 0, 0);
    };
  }
  onClick(
    coords: Callback.ItemUseCoordinates,
    item: ItemInstance,
    block: Tile,
    player: number
  ) {
    const region = BlockSource.getDefaultForDimension(InfiniteForest.id);
    if (!region) return;
    alert("!")
    let coordsX = [] as Vector[];
    let coordsZ = [] as Vector[];
    for (let i = -1; i <= 1; i++) {
      for (let k = -1; k <= 1; k++) {
        if (i === 0 && k === 0) continue;
        coordsX.push({
          x: coords.x + i,
          y: coords.y + k,
          z: coords.z,
        });
        coordsZ.push({
          x: coords.x,
          y: coords.y + k,
          z: coords.z + i,
        });
      }
    };
      if(this.key.isValid(item, player)) {
        alert("key valid")
        this.openIfValid([].concat(coordsX).concat(coords), region, item, player);
        this.openIfValid([].concat(coordsZ).concat(coords), region, item, player)
      }
    }
  
}

namespace DungeonDoorList {
    export const ICE_DUNGEON_DOOR = new DungeonDoor("ice_dungeon_door", "ice_dungeon_lock", DungeonKeyList.IceKey);
}