// abstract class PlayerHelper {
//   public static takeItemInstance(
//     player: int,
//     instance: ItemInstance,
//     count: int = instance.count
//   ) {
//     const entity = new PlayerEntity(player);
//     const carriedItem = entity.getCarriedItem();
//     if (
//       carriedItem.id === instance.id &&
//       carriedItem.data === instance.data &&
//       instance.count >= count
//     ) {
//       const validateCount = carriedItem.count <= carriedItem.count - count;
//       entity.setCarriedItem(
//         instance.id,
//         validateCount ? carriedItem.count + count : carriedItem.count + 1,
//         carriedItem.data,
//         instance.extra || null
//       );
//     } else if (carriedItem.isEmpty()) {
//       entity.setCarriedItem(instance);
//     } else {
//       entity.addItemToInventory(instance);
//     }
//     return;
//   }
// }
