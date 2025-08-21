namespace NotificationStyles {
    export const INFINITE_FOREST_LEARNING: INotificationParams = {
        thread: {
            reachTime: 2000,
            queueTime: 1000
        },
        window: {
            width: 240,
            height: 40
        },
        elements: {
            background: {
                type: "image",
                x: 0,
                y: 0,
                width: 240 * 2.3,
                height: 40 * 2.3,
                bitmap: "notification"
            },
            text: {
                type: "text",
                x: 48,
                y: 9,
                maxLineLength: 30,
                font: {
                    size: 25
                }
            },
            icon: {
                type: "image",
                x: 8,
                y: 5,
                scale: 1.8,
                size: 70,
                width: 27,
                height: 27
            }
        }
    }
}

Notification.get("advancement")
.addStyle("infinite_forest.learning", NotificationStyles.INFINITE_FOREST_LEARNING);

const NoteComponent = (properties: { item?: string, bitmap?: string }, children: string) => (
    <>
        <text>{ Translation.translate(children) }</text>
        <icon item={ properties.item || null }>{ properties.bitmap || "unknown" }</icon>
    </>
);
// const context = this.UI.getContext();
// const notification = new android.app.Notification.Builder(context)
// .setContentText("Возвращайтесь скорее!")
// .setContentTitle("Infinite Forest")
// .setSmallIcon(com.zheka.horizon.R.drawable.ic_launcher)
// .setAutoCancel(true)
// .build();
// const notificationManager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE);
// notificationManager.notify(1, notification);