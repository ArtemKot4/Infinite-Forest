
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
}

const FlameDust = new FItem("flame_dust");
const IceDust = new FItem("ice_dust");

FlameDust.onUse((coords, item, block) => {
  const minus = Entity.setCarriedItem//(player, item.id, item.count - 1, 0);
  const region = BlockSource.getDefaultForActor(Player.get());
 if(block.id === BlockID["eucalyptus_torch"]) { minus(Player.getLocal(), item.id, item.count - 1, 0);
     region.setBlock(coords.x, coords.y, coords.z, BlockID["flamed_eucalyptus_torch"],0)
 }
});

IceDust.onUse((coords, item, block) => {
  const minus = Entity.setCarriedItem//(player, item.id, item.count - 1, 0);
  const region = BlockSource.getDefaultForActor(Player.get());
 if(block.id === BlockID["eucalyptus_torch"]) { minus(Player.getLocal(), item.id, item.count - 1, 0);
     region.setBlock(coords.x, coords.y, coords.z, BlockID["iced_eucalyptus_torch"],0)
 }
})