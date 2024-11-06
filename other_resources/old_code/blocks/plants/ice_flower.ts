namespace Plants {
    Plants.registry("ice_flower", "ice_flower", BLOCK_TYPE_FIRE);
breakHasAir(EForestPlants.ICE_FLOWER);
setPlaceFunction(EForestPlants.ICE_FLOWER, [VanillaBlockID.grass, VanillaBlockID.snow, VanillaBlockID.ice, VanillaBlockID.blue_ice, VanillaBlockID.packed_ice, VanillaBlockID.frosted_ice]);
}