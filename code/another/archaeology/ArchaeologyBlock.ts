type chance = 10 | 50 | 40 | 25 | 65;
type number3 = [number, number, number];

namespace Archaeology {

export interface IDrop {
  instance: ItemInstance, chance?: int | [int, int], action?: Block.ClickFunction
}

export const list: Set<IDrop> = new Set();

export function registerDrop(instance: ItemInstance, chance?: int | [int, int], action?: Block.ClickFunction) {
  list.add(Object.assign({instance, chance: chance || 25}, action && {action}));
};

export class CustomBlock extends FBlock {
  constructor(id: string, texture: string) {
    super(id, [
      {
        "inCreative": true,
        "name": "block.infinite_forest." + id,
        "texture": [[texture || id, 0]]
      }
    ]);
   
   Block.registerClickFunctionForID(BlockID[id], this.onUse.bind(this));

   Block.setShape(BlockID[id], 0, 0, 0, 1, 15/16, 1, 1);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 14/16, 1, 2);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 13/16, 1, 3);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 12/16, 1, 4);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 11/16, 1, 5);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 10/16, 1, 6);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 9/16, 1, 7);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 8/16, 1, 8);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 7/16, 1, 9);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 6/16, 1, 10);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 5/16, 1, 11);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 4/16, 1, 12);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 3/16, 1, 13);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 2/16, 1, 14);
   Block.setShape(BlockID[id], 0, 0, 0, 1, 1/16, 1, 15);

  };

  onUse(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile, player: number) {
    const region = BlockSource.getDefaultForActor(player);
    let isValid = true;

    region.destroyBlock(coords.x, coords.y, coords.z, false);  

     if(block.data < 15) {

       region.setBlock(coords.x, coords.y, coords.z, this.getID(), block.data+1);
       
     } else {


      list.forEach((v) => {

        if(!isValid) {
          return;
        };

        if(Math.random() < MathHelper.randomValueFromArray([].concat(v.chance))) {
          
        region.spawnDroppedItem(coords.x + 0.5, coords.y + 0.1, coords.z + 0.5,
           v.instance.id, v.instance.count, v.instance.data, v.instance.extra);

           v.action && v.action(coords, v.instance, block, player);

           isValid = false;
           return;
        } 
      })
    
     };
  }
}


  export const SAND = new CustomBlock("archaeology_sand", "sand").create();
  registerDrop(new ItemStack(VanillaItemID.diamond, 1, 0));
  registerDrop(new ItemStack(VanillaItemID.gunpowder, 1, 0));
  registerDrop(new ItemStack(LOST_PAPER.item.getID(), 1, 0), 90, (coords, item, block, player) => {
    const extra = item.extra;
    
    if(!extra) {
      return;
    };

    if(extra.getString("text") === "sign") {
      BookUI.givePage(player, "sign_title", "unknown")
    }
  });
}

