const MushroomUmbrella = new AdvancedItem("mushroom_umbrella", 1);

MushroomUmbrella.setModel({
    model: "mushroom_umbrella", onHand: true
}, "mushroom_umbrella", 0, {scale: [1.5, 1.5, 1.5], translate: null , invertV: false, noRebuild: false }); //TODO: сделать текстуру и модельку

MushroomUmbrella.getItemForHand(() => {
  //  if(...) {
      setTickInterval(() => {Entity.addEffect(Player.getLocal(), EPotionEffect.SLOW_FALLING, 10, 6,true, false);
        const pos = Entity.getPosition(Player.getLocal())
            Particles.addParticle(flame_blue, pos.x, pos.y - 1.65, pos.z, 0, 0.1, 0, 0)
        }, 5)  
    //}
})