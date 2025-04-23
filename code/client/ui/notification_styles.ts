namespace ENotificationStyle {
    export const LEARNING: INotificationStyle = {
        waitTime: 2000,
        queueTime: 1000,
        scale: 2.3,
        width: 240,
        height: 40,
        background: {
            type: "image",
            x: 0,
            y: 0,
            width: 240 * 2.3,
            height: 40 * 2.3,
            bitmap: "notification",
            onInit(element, style, runtimeStyle) {
                const text = runtimeStyle["text"].text || "";

                if(text.length > 28) {
                    element.height = (40 + text.length / 30) * 2.3;
                    alert('сменено')
                }
            }
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
};

Notification.get("achievement").addStyle("IFLearning", ENotificationStyle.LEARNING);
