namespace NotificationStyles {
    export const LEARNING: INotificationStyle = {
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
            bitmap: {
                default_x: 8,
                default_y: 18,
                width: 27,
                height: 27
            },
            item: {
                default_x: 2.3,
                default_y: 2.3,
                size: 90
            }
        }
    }
};

Notification.addStyle("learning", NotificationStyles.LEARNING);
