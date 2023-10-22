
let model = (function(obj, texture_default, data_default){
	obj = obj || {};
	const texture = texture_default || 1, data = data_default || 0;
	let model = new RenderUtil.Model();
	model.addBoxByBlock("cube", 0.3125, 0.5625, 0.875, 0.6875, 0.6875, 0.9375, obj["cube"] ? obj["cube"].texture : texture, obj["cube"] ? obj["cube"].data : data);
	model.addBoxByBlock("cube_2", 0.3125, 0.3125, 0.6875, 0.6875, 0.5, 0.75, obj["cube_2"] ? obj["cube_2"].texture : texture, obj["cube_2"] ? obj["cube_2"].data : data);
	model.addBoxByBlock("cube_3", 0.3125, 0, 0.3125, 0.6875, 0.125, 0.6875, obj["cube_3"] ? obj["cube_3"].texture : texture, obj["cube_3"] ? obj["cube_3"].data : data);
	model.addBoxByBlock("cube_4", 0.3125, 0.5625, 0.0625, 0.6875, 0.6875, 0.125, obj["cube_4"] ? obj["cube_4"].texture : texture, obj["cube_4"] ? obj["cube_4"].data : data);
	model.addBoxByBlock("cube_5", 0.3125, 0.3125, 0.25, 0.6875, 0.5, 0.3125, obj["cube_5"] ? obj["cube_5"].texture : texture, obj["cube_5"] ? obj["cube_5"].data : data);
	model.addBoxByBlock("cube_6", 0.875, 0.5625, 0.3125, 0.9375, 0.6875, 0.6875, obj["cube_6"] ? obj["cube_6"].texture : texture, obj["cube_6"] ? obj["cube_6"].data : data);
	model.addBoxByBlock("cube_7", 0.6875, 0.375, 0.3125, 0.75, 0.5, 0.6875, obj["cube_7"] ? obj["cube_7"].texture : texture, obj["cube_7"] ? obj["cube_7"].data : data);
	model.addBoxByBlock("cube_8", 0.0625, 0.5625, 0.3125, 0.125, 0.6875, 0.6875, obj["cube_8"] ? obj["cube_8"].texture : texture, obj["cube_8"] ? obj["cube_8"].data : data);
	model.addBoxByBlock("cube_9", 0.25, 0.375, 0.3125, 0.3125, 0.5, 0.6875, obj["cube_9"] ? obj["cube_9"].texture : texture, obj["cube_9"] ? obj["cube_9"].data : data);
	model.addBoxByBlock("cube_10", 0.125, 0.5, 0.1875, 0.875, 0.625, 0.8125, obj["cube_10"] ? obj["cube_10"].texture : texture, obj["cube_10"] ? obj["cube_10"].data : data);
	model.addBoxByBlock("cube_11", 0.1875, 0.5, 0.8125, 0.8125, 0.625, 0.875, obj["cube_11"] ? obj["cube_11"].texture : texture, obj["cube_11"] ? obj["cube_11"].data : data);
	model.addBoxByBlock("cube_12", 0.1875, 0.5, 0.125, 0.8125, 0.625, 0.1875, obj["cube_12"] ? obj["cube_12"].texture : texture, obj["cube_12"] ? obj["cube_12"].data : data);
	model.addBoxByBlock("cube_13", 0.375, 0.125, 0.375, 0.625, 0.5, 0.625, obj["cube_13"] ? obj["cube_13"].texture : texture, obj["cube_13"] ? obj["cube_13"].data : data);
	model.addBoxByBlock("cube_14", 0.375, 0.625, 0.375, 0.625, 0.6875, 0.625, obj["cube_14"] ? obj["cube_14"].texture : texture, obj["cube_14"] ? obj["cube_14"].data : data);
	model.addBoxByBlock("cube_15", 0.3125, 0.6875, 0.3125, 0.6875, 0.75, 0.6875, obj["cube_15"] ? obj["cube_15"].texture : texture, obj["cube_15"] ? obj["cube_15"].data : data);
	return model;
});//boxes - 15


IDRegistry.genBlockID("infinite_altar");
Block.createBlock("infinite_altar", [
  {
    name: "Infinite altar",
    texture: [
      ["eucalyptus", 0],
    ],
    inCreative: true,
  },
]);

model({}, BlockID.infinite_altar,0).setBlockModel(BlockID.infinite_altar)


TileEntity.registerPrototype(BlockID.infinite_altar, {
  defaultValues: { white: false, blue: false, orange: false, isLock: false},
  useNetworkItemContainer: true,
  tick: function () {
    if(this.data.blue==true){
      Particles.addParticle(flame_blue,this.x+0.5,this.y+0.7,this.z+0.5, 0,0,0)
      
    }else if(this.data.orange==true){
      Particles.addParticle(flame_orange,this.x+0.5,this.y+0.7,this.z+0.5, 0,0,0)
    }else{
      Particles.addParticle(flame_white,this.x+0.5,this.y+0.7,this.z+0.5, 0,0,0)
    }
      },
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
