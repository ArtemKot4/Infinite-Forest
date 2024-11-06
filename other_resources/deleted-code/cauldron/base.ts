namespace Cauldron {
  export const BLOCK = new AdvancedBlock(
    "iron_cauldron",
    [
      {
        name: "Iron cauldron",
        texture: [["iron_cauldron", 0]],
        inCreative: true,
      },
    ],
    {
      model: "iron_cauldron",
      texture: "iron_cauldron",
    }
  );
  BLOCK.visual();
    Block.setDestroyLevel("iron_cauldron", EDestroyLevel.IRON);

  const content = { elements: {} };

  for (let i = 0; i < 9; i++) {
    content.elements["slot_" + i] = {
      type: "slot",
    };
  }

  export const GUI = new UI.StandardWindow(content);

  export function itemMorph(animation: Animation.Item, container, name, slot) {
    const size = hasBlock(slot.id) ? 0.2 : 0.3;
    const IDBlock = VMath.randomValue(VanillaBlockID.gravel, VanillaBlockID.dirt, 
      BlockID.eucalyptus_log, BlockID.pink_log);

    const IDItem = VMath.randomValue(VanillaBlockID.seagrass, VanillaBlockID.grass, 
      VanillaBlockID.red_mushroom, VanillaBlockID.brown_mushroom)
    container.setSlot(
      name,
      hasBlock(slot.id) ? IDBlock : IDItem,
      slot.count,
      slot.data,
      null
    );
    animation.describeItem({
      id: slot.id,
      count: slot.count,
      data: slot.data,
    });
    animation.setItemSize(size);
    animation.refresh();
  }


  export interface IRecipesData {
    result: int, input_0: int, input_1?: int, input_2?: int,
    input_3?: int,input_4?: int,input_5?: int,input_6?: int,input_7?: int,input_8?: int,
  }

  export const recipes = {
    data: [],
    registry(obj: IRecipesData, time: int): void {
        obj.input_1 || 0;
        obj.input_2 || 0;
        obj.input_3 || 0;
        obj.input_4 || 0;
        obj.input_5 || 0;
        obj.input_6 || 0;
        obj.input_7 || 0;
        obj.input_8 || 0;
    this.data.push(ObjectAssign(obj, {time}));
    },
    hasRecipe(container: ItemContainer, slot: string, id: int) {
        if(container.getSlot(slot).id !== id) return false;
             return true;  

  },
  };

recipes.registry({
  result: VanillaItemID.apple, input_0: VanillaItemID.golden_apple
}, 10);

  export const WATERMESH = new RenderMesh();
  WATERMESH.addVertex(-6 / 16, 0, -6 / 16, 0, 0);
  WATERMESH.addVertex(6 / 16, 0, -6 / 16, 1, 0);
  WATERMESH.addVertex(-6 / 16, 0, 6 / 16, 0, 1);

  WATERMESH.addVertex(6 / 16, 0, -6 / 16, 1, 0);
  WATERMESH.addVertex(-6 / 16, 0, 6 / 16, 0, 1);
  WATERMESH.addVertex(6 / 16, 0, 6 / 16, 1, 1); //z 6 / 16
  export function onBurn(that) {
    const x = randomInt(0.01, 0.02);
    return (
      spawnParticle(
        EParticles.CAULDRON_BUBBLE,
        that.x - x,
        that.y + 1.1,
        that.z + 0.4,
        0,
        0.02,
        0
      ),
      spawnParticle(
        EParticles.CAULDRON_BUBBLE,
        that.x + x,
        that.y + 1.1,
        that.z + 0.5,
        0,
        0.02,
        0
      ),
      spawnParticle(
        EParticles.CAULDRON_BUBBLE,
        that.x + x,
        that.y + 1.1,
        that.z + 0.6,
        0,
        0.02,
        0
      )
    );
  }

  export function nonWaterDialog(player): void {
    nonWaterDialog.prototype.counter++;
    const desc = VMath.randomValue(
      "You really think that it good idea?",
      "Whats the point of that?",
      "Thats now how it works :)",
      "If you don't stop, i must crash game",
      "You need to pour water in caludron",
      "Stop!"
    );

    const color = VMath.randomValue(
      Native.Color.GREEN,
      Native.Color.DARK_GREEN,
      Native.Color.RED,
      Native.Color.BLUE,
      Native.Color.OBFUSCATED + Native.Color.UNDERLINE
    );

    Game.tipMessage(color + Translation.translate(desc));
    if (nonWaterDialog.prototype.counter > 10) {
      CauldronBase.damageByBoiling(player),
        Game.message(Native.Color.RED + Translation.translate(desc));
    };
    if (nonWaterDialog.prototype.counter >= 20) {
      nonWaterDialog.prototype.counter = 0 }
   };

   nonWaterDialog.prototype.counter = 0;

  }
 



