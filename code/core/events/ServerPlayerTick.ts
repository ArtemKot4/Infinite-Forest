Callback.addCallback("ServerPlayerTick", (playerUid: number) => {
    const player = new PlayerEntity(playerUid);

      if(World.getThreadTime() % 8 === 0) {

         const selectedItemStack = player.getInventorySlot(player.getSelectedSlot());
         const carriedItemStack = player.getCarriedItem();

         const handFunction = ItemForest.itemOnHandFuncs.get(selectedItemStack.id);

         if(selectedItemStack.id == carriedItemStack.id && handFunction !== undefined) {
              return handFunction(selectedItemStack);
           };
      };
});