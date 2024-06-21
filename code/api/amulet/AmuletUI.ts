class AmuletUI {
  public readonly container = new UI.Container();
  public UI = new UI.Window({
    drawing: [
      {
        type: "background",
        color: android.graphics.Color.argb(0.3, 56 / 256, 65 / 256, 56 / 256),
      },
    ],
  });
};

