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

  export const recipes = {
    data: {},
    registry(obj: { input; output; time }): void {
      const { input, output, time } = obj;
      this.data[input] = {
        input: input,
        output: output,
        time: time,
      };
      if (!!obj || typeof obj !== "object")
        throw new Error("You must register recipe in object format!");
    },
    hasRecipe(obj: { input; output; result_timer }, container, data) {
      const { input, output, result_timer } = obj;
      const slot = container.getSlot("slot").id;
      if (input === slot) {
        if (data.result_timer < result_timer) {
          return data.result_timer++;
        }
        if (data.result_timer >= result_timer) {
          container.setSlot("slot", output, 1, 0, null);
          return true;
        }
      }
    },
  };

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
 



