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
  
    const content = { elements: {} };
  
    for (let i = 0; i < 9; i++) {
      content.elements["slot_" + i] = {
        type: "slot",
      };
    };
  
    export const GUI = new UI.StandardWindow(content);
  
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
    WATERMESH.addVertex(-6 / 16, 0, -6 / 16);
    WATERMESH.addVertex(5 / 16, 0, -6 / 16);
    WATERMESH.addVertex(-6 / 16, 0, 5 / 16);
  
    WATERMESH.addVertex(5 / 16, 0, -6 / 16);
    WATERMESH.addVertex(-6 / 16, 0, 5 / 16);
    WATERMESH.addVertex(5 / 16, 0, 5 / 16); //z 6 / 16
    export function onBurn(that) {
      const x = randomInt(0.01, 0.06);
      const z = randomInt(0.01, 0.08);
      return (
      spawnParticle(EParticles.CAULDRON_BUBBLE, that.x + x, that.y + 1.1, that.z + z, 0, 0.05, 0 ),
      spawnParticle(EParticles.CAULDRON_BUBBLE, that.x + x, that.y + 1.1, that.z + z, 0, 0.05, 0 ),
      spawnParticle(EParticles.CAULDRON_BUBBLE, that.x + x, that.y + 1.1, that.z + z, 0, 0.05, 0 )
      )
    };

    export function nonWaterDialog() {
      const random = randomInt(1, 3);
      let desc = "";
      switch (random) {
        case 3: desc = "You really think that it good idea?"; break;
        case 2: desc = "Whats the point of that?"; break;
        case 1: desc = "Thats now how it works :)"; break;
      }
      Game.tipMessage(Native.Color.GOLD + Native.Color.UNDERLINE + Translation.translate(desc))
    }
};

