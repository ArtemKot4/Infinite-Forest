// const INFO_TABLE = new UI.Window({
//     location: {
//       x: 0,
//       y: 0,
//       width: 1000,
//       height: 560,
//     },
//     drawing: [
//       { type: "background", color: android.graphics.Color.argb(0, 0, 0, 0) },
//       { type: "bitmap", bitmap: "info_table", scale: 4.2, x: 300, y: 400 },
//     ],
//     elements: {
//       description: {
//         type: "text",
//         x: 250,
//         y: 300,
//         size: 15,
//         "text": "Standart text",
//       },
//     },
//   });
  
//   const CONTAINER_TABLE = new UI.Container();
//   INFO_TABLE.setAsGameOverlay(true);
  
//   function openIfCan(container: UI.Container, UI: UI.Window) {
//     if(container.isOpened() === false) {
//         container.openAs(UI)
//     }
//   };

// Callback.addCallback("NativeGuiChanged", (screenName) => {
//   if (screenName === "in_game_play_screen") {
//     if (World.getThreadTime() % 10 === 0) {
//       if (
//         Player.getPointed().block.id === Mill.EMillID.MAIN_BLOCK) {
//         alert("Открыто")
//         openIfCan(CONTAINER_TABLE, INFO_TABLE);
//         CONTAINER_TABLE.setText("text", "MAIN BLOCK")
//       } else {
//         CONTAINER_TABLE.close();
//         Game.message("Игрок смотрит на другой " + Player.getPointed().block.id)
//     }
//     } 
//   }
// });

