Notification.addStyle("learning", {
    scale: 2.3,
    width: 240,
    height: 40,
    wait_time: 2,
    queue_time: 1,
    background: {
        bitmap: "notification"
    },
    text: {
        default_x: 48,
        default_y: 37,
        max_length: 30
    },
    icon: {
        default_x: 9,
        default_y: 20,
        width: 27,
        heigth: 27,
        item_scale: 1.3
    }
});

Callback.addCallback("ItemUse", (coords, item, block, isEx, player) => {
    if(item.id === VanillaItemID.arrow) {
        return Notification.sendFor(player, "learning", "Это тест нового формата", "wheat_flour", "item");
    };
}); //todo: debug

// Network.addClientPacket("packet.infinite_forest.send_learning_notification", (data: { learning: string }) => {
//     LearningNotification.open(data.learning);
// });