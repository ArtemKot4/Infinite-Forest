function spawnStars(coords) {
  if (World.getLightLevel(coords.x,coords.y,coords.z)<5) {
    for(var r=10;r<100;r++)
    Particles.addParticle(
      star,
      coords.x + r,
      coords.y + 30,
      coords.z + r,
      0,
      -2,
      0
    );
    // if(source.getLightLevel(x,y,z)<=4){
    //  Particles.addParticle(star,posx,posy,0.5,0,-0.1,0)
    // }
  }
}
