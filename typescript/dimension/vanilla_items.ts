// const Item_AdaptedScript = ModAPI.requireGlobal("Item");
const setupFlatModel = (id: universal, texture: string) => {
const mesh = new RenderMesh();
const validation = typeof id === "string" ? ItemID[id] : id

mesh.addVertex(0, 0, 0, 0, 0);
mesh.addVertex(1, 0.5, 0, 1, 0);
mesh.addVertex(0, 0.5, 1, 0, 1);

mesh.addVertex(1, 0.5, 0, 1, 0);
mesh.addVertex(0, 0.5, 1, 0, 1);
mesh.addVertex(1, 1, 1, 1, 1);
return ItemModel.getForWithFallback(validation, 0).setModel(mesh, "items-opaque/" + texture + ".png")
.setItemTexture(texture, 0);
};

setupFlatModel(VanillaItemID.clock, "forest_clock");

// const model = ItemModel.getForWithFallback(VanillaItemID.clock, 0);
// model.setItemTexture("terrain-atlas/forest_clock.png", 0);
// model.setModel(model.getItemRenderMesh(1, false), "terrain-atlas/forest_clock.png");

// namespace Visuality {
//   export const LETTERS = {
//    // a: {u, v},
//     b: {},
//     c: {},
//     d: {},
//     e: {}

//   }
//   export function setupFlatDescriptor(coords, text: string): void {
//     const Base = new Animation.Base(coords.x, coords.y + 1.5, coords.z);
   
//     const separator = text.split("");
//     const Mesh = new RenderMesh();
//  //   Mesh.addVertex();
//     Base.describe({mesh: Mesh, skin: "font/glyph_04.png"})
//   }
// }