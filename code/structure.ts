//для старых структур 
// function setStructureWorld(name, coords, rotation){
// let stru = FileTools.ReadJSON(__dir__+"/objects/"+name);
// for(let i in stru){
// switch(rotation || 0){
// case 0:
// var x1 = stru[i].x;
// var y1 = stru[i].y;
// var z1 = stru[i].z;
// break;
// case 1:
// var x1 = stru[i].z;
// var y1 = stru[i].y;
// var z1 = stru[i].x;
// break;
// case 2:
// var x1 = -stru[i].x;
// var y1 = stru[i].y;
// var z1 = stru[i].z;
// break;
// case 3:
// var x1 = -stru[i].z;
// var y1 = stru[i].y;
// var z1 = stru[i].x;
// break;
// }
// World.setBlock(x1+coords.x, y1+coords.y, z1+coords.z, stru[i].id, stru[i].data);
// }
// }
// //для новых структур 
// IMPORT("DungeonCore");
// IMPORT("TileRender");
// DungeonCore.setPath("objects/");
// //генератор предметов 
// let gen = new ItemGenerate.advanced();
// gen.addItem(264, 0.1);
// gen.addItem(266, 0.2, {slotMax: 3, slotMin: 0, max: 3});
// gen.addItem(VanillaItemID.totem, 0.01);
// gen.addItem(VanillaItemID.bone, 0.8, {slotMax: 3, slotMin: 1, max: 2});
// gen.addItem(265, 0.6, {slotMax: 3, slotMin: 1, max: 3});
// gen.addItem(VanillaItemID.rotten_flesh, 1, {slotMax: 4, slotMin: 1, max: 2});
// Callback.addCallback("ModsLoaded", function (){
//     gen.addItem(ItemID.clitok, 0.3, {slotMax: 2, max: 2});
//     gen.addItem(ItemID.keyDungeon, 0.2);
//     gen.addItem(ItemID.koin_1, 0.1);
//     gen.addItem(ItemID.manysript1, 0.3)
//     gen.addItem(ItemID.piece4, 0.5)
//     gen.addItem(ItemID.ingotCopper, 0.4, {slotMax: 2, max: 2})
//     gen.addItem(ItemID.ingotBlue, 0.2, {slotMax: 2, max: 2})
// });
// gen.addItem(ItemID.orange_crystal, 0.2);
// Callback.addCallback("PreProcessChunk", function(chunkX, chunkZ, random, dimension){
// if(dimension == InfinityForest.id){
//     for(let i = 0;i <= random.nextInt(14)+2;i++){
// let coords = GenerationUtils.findSurface(chunkX*16 + random.nextInt(4+i), 96, chunkZ*16 + random.nextInt(4+i));
// if(World.getBlock(coords.x, coords.y+1, coords.z).id==0)World.setBlock(coords.x, coords.y+1, coords.z, 31, random.nextInt(2));
// }
// let r = random.nextInt(1000);
// if(r == 1){
// let coords = GenerationUtils.findSurface(chunkX*16 + random.nextInt(16), 96, chunkZ*16 + random.nextInt(16));
// Utility.setStruc("structure2", coords);
// gen.fillChest(coords.x, coords.y, coords.z);
// }else if(r <= 3){
// let coords = GenerationUtils.findSurface(chunkX*16 + random.nextInt(16), 96, chunkZ*16 + random.nextInt(16));
// DungeonCore.setStructure("structure1", coords.x, coords.y, coords.z);
// gen.fillChest(coords.x, coords.y+2, coords.z);
// }else if(r <= 8){
// let coords = GenerationUtils.findSurface(chunkX*16 + random.nextInt(16), 96, chunkZ*16 + random.nextInt(16));
// setStructureWorld("cottage.json", coords, 0);
// }else if(r <= 30){
// let coords = GenerationUtils.findSurface(chunkX*16 + random.nextInt(16), 96, chunkZ*16 + random.nextInt(16));
// setStructureWorld("chest.json", coords, 0);
// gen.fillChestSid(coords.x, coords.y+8, coords.z, random);
// }/*else if(r <= 830){
// let coords = GenerationUtils.findSurface(chunkX*16 + random.nextInt(16), 96, chunkZ*16 + random.nextInt(16));
// setStructureWorld("oak_"+(random.nextInt(1)+1)+".json", coords, random.nextInt(3));
// }*/
// }
// });
