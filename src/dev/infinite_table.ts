
let model = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || 1, data = data_default || 0;
	let model = new RenderUtil.Model();
	model.addBoxByBlock("cube", 0.125, 0, 0.125, 0.875, 1, 0.875, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	//model.addBoxByBlock("cube_2", 0.125, 1, 0.125, 0.875, 1, 0.875, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	return model;
});//boxes - 2

IDRegistry.genBlockID("infinite_altar");
Block.createBlock("infinite_altar", [
  {
    name: "Infinite altar",
    texture: [
      ["eucalyptus", 1],
    ],
    inCreative: true,
  },
]);

model({}, BlockID.infinite_altar,0).setBlockModel(BlockID.infinite_altar)


TileEntity.registerPrototype(BlockID.infinite_altar, {
  defaultValues: { white: false, blue: false, orange: false, isLock: false},
  useNetworkItemContainer: true,
  tick: function () {
    if(World.getThreadTime()%2==0){
    if(this.data.blue==true){
      Particles.addParticle(flame_blue,this.x+0.5,this.y+0.7,this.z+0.5, 0,0,0)
      
    }else if(this.data.orange==true){
      Particles.addParticle(flame_orange,this.x+0.5,this.y+0.7,this.z+0.5, 0,0,0)
    }else{
      Particles.addParticle(flame_white,this.x+0.5,this.y+0.7,this.z+0.5, 0,0,0)
    }
      }},
      click: function(id,count,data,coords,player,extra){
        var item = Entity.getCarriedItem(player)
        if(item.id==ItemID.blue_crystal&&this.data.isLock==false){
          this.data.blue=true;
          this.data.isLock=true
        }else if(item.id==ItemID.orange_crystal&&this.data.isLock==false){
          this.data.orange=true;
          this.data.isLock=true
        }
        if(Entity.getSneaking(player)==true){
          this.data.isLock=false;
          this.data.orange=false;
          this.data.blue=false;
        }
      }
  
  
  // destroy: function (id,count,data,coords,block){

  // }
});
