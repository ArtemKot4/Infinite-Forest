namespace Mill {
   
 class BladesStation extends MultiBlock {
    public defaultValues = {
        power: false
    };

 }

 TileEntity.registerPrototype(EMillID.BLADES_STATION
    , new BladesStation())
}