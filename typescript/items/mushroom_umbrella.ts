const MushroomUmbrella = new AdvancedItem("mushroom_umbrella", 1);

MushroomUmbrella.setModel({
    model: "mushroom_umbrella", onHand: false
}); //TODO: сделать текстуру и модельку

MushroomUmbrella.getItemForHand(() => {
  //  if(...) {
        Entity.addEffect(Player.getLocal(), EPotionEffect.SLOW_FALLING, 3, 6, false, false)
    //}
})