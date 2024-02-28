
new FItem("blue_crystal", 1);
new FItem("orange_crystal");

function getCoords (): void {
  const players = Network.getConnectedPlayers();

  for (const i in players) {
  const position = Entity.getPosition(Number(players))
    const a = [];
    a.push(position);
    Game.message(JSON.stringify(a))
    Game.message(JSON.stringify(position))
  }
};

const changeTorchSpecial = (special: "iced" | "flamed", coords}) => {
    const minus = Entity.setCarriedItem;
  const region = BlockSource.getDefaultForActor(Player.getLocal());
 if(block.id === BlockID["eucalyptus_torch"]) { minus(Player.getLocal(), item.id, item.count - 1, 0);
 const place = coords.relative;
 for(let i = 0; i <= 10; i++){
 spawnParticle(smoke, coords.x, coords.y + 0.8, coords.z, 0, 0.3, 0)
     region.setBlock(coords.x, coords.y, coords.z, BlockID[special + "_eucalyptus_torch"],0)
 }
 }
}
 
const FlameDust = new FItem("flame_dust");
const IceDust = new FItem("ice_dust");

FlameDust.onUse((coords, item, block) => {
  changeTorchSpecial("flamed", coords)
});


IceDust.onUse((coords, item, block) => {
  changeTorchSpecial("iced", coords)
});