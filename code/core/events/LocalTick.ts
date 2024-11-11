// abstract class SkyAnimator {

//   public static previousSky = new RGB(21, 96, 189);
//   public static previousFog = new RGB(0, 128, 0);

//   protected static active = false;

//   protected static equalNum(previous: number, current: number) {

//     if(previous < current) {
//       previous++;
//     };

//     if(previous > current) {
//       previous--;
//     };

//     return previous;
//   };

//   protected static equalRGB(previous: RGB, current: RGB) {

//     const r = this.equalNum(previous.r, current.g);
//     const g = this.equalNum(previous.g, current.g);
//     const b = this.equalNum(previous.b, current.b);

//     return new RGB(r, g, b);
//   };

//   public static formUpdatable(value: "previousSky" | "previousFog", newColor: RGB) {

//     if(RGB.equals(SkyAnimator[value], newColor)) {
//       return;
//     };

//     if(this.active) {
//       return false;
//     };

//     this.active = true;

//     const self = this;

//     return {
//       previous: SkyAnimator[value],
//       current: newColor,
//       update() {

//        const color = this.previous = SkyAnimator.equalRGB(this.previous, this.current);

//        NativeAPI.setSkyColor(color.r / 256, color.g / 256, color.b / 256);
       
//        if(RGB.equals(color, this.current)) {

//          SkyAnimator[value] = color;

//          this.remove = true;
//          self.active = false;
//        };

//      },
//     }
//   };
  
//   public static changeSkyColor(newColor: RGB) {
//     const updatable = this.formUpdatable("previousSky", newColor);

//     if(updatable) {
//       alert("цвет неба изменён")
//       Updatable.addLocalUpdatable(updatable);
//     }
        
//   };

//   public static changeFogColor(newColor: RGB) {
//     const updatable = this.formUpdatable("previousFog", newColor);

//     if(updatable) {
//       alert("цвет тумана изменён")
//       Updatable.addLocalUpdatable(updatable);
//     }
        
//   };

//   public static clearSkyColor() {
//     return this.changeSkyColor(new RGB(21, 96, 189));
//   };

//   public static clearFogColor() {
//     return this.changeFogColor(new RGB(0, 128, 0));
//   }
// }

Callback.addCallback("LocalTick", () => {
  if (Player.getDimension() !== InfiniteForest.id) {
    return;
  };

  const pos = Player.getPosition();
  const region = BlockSource.getCurrentClientRegion();
  const biome = region.getBiome(pos.x, pos.z);
  const params = BiomeBase.data[biome] as BiomeBase & BiomeBehaviour;

  if(!params) {
    return;
  };

  const time = World.getThreadTime();

  if (time % 120 === 0) {

    // if(pos.y >= 110) {
    //     SkyAnimator.changeSkyColor(new RGB(170, 170, 170));
    //     SkyAnimator.changeFogColor(new RGB(100, 100, 100));
    //     return;
    // }

    // const skyColor = params.getRuntimeSkyColor && params.getRuntimeSkyColor();
    // const fogColor = params.getRuntimeFogColor && params.getRuntimeFogColor();

    // if(skyColor) {
    //     SkyAnimator.changeSkyColor(skyColor);
    // } else {
    //     SkyAnimator.clearSkyColor();
    // };

    // if(fogColor) {
    //   SkyAnimator.changeFogColor(fogColor);
    // } else {
    //   SkyAnimator.clearFogColor();
    // };
    
  };

  if(time % 30 == 0 && params && params.onTick) {
       return params.onTick(Player.getLocal(), region, pos.x, pos.y, pos.z);
  };

});
