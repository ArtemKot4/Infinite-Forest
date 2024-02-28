const MushroomUmbrella = new AdvancedItem("mushroom_umbrella", 1, "Mushroom Umbrella",
 "mushroom_umbrella_icon", {
    model: "mushroom_umbrella", importParams: {scale: [1.5, 1.5, 1.5], translate: [0.5, 0.5, 0.5],
        invertV: false, noRebuild: false },onHand: true, 
});

MushroomUmbrella.getItemForHand(() => {
  //  if(...) {
      setTickInterval(() => {Entity.addEffect(Player.getLocal(),
         EPotionEffect.SLOW_FALLING, 60, 12,true, false);
        const pos = Entity.getPosition(Player.getLocal())
            Particles.addParticle(flame_blue, pos.x, pos.y - 1.65, pos.z, 0, 0.1, 0, 0)
         }, 5)  
    //}
})