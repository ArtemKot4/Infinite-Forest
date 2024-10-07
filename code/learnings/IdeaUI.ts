abstract class IdeaUI {
    protected constructor() {}
  
    public static readonly FRAME_MAX = 10;
    public static readonly IMAGE_SCALE = 22.5;
    public static readonly HEIGHT_LOCATION = 23.5;
    public static readonly WIDTH_LOCATION = 310;
  
    public static GUI = new UI.Window({
  
      drawing: [
        { type: "background", color: android.graphics.Color.argb(0, 0, 0, 0) },
      ],
      elements: {
        image: {
          type: "image",
          x: this.WIDTH_LOCATION,
          y: this.HEIGHT_LOCATION,
          bitmap: "idea_book.book_open_0",
          scale: this.IMAGE_SCALE,
        },
      },
    });
  
    public static redrawImage(frame: int, scale: int, x?: int, y?: int) {
      IdeaUI.GUI.content.elements["image"] = {
        type: "image",
        x: x || this.WIDTH_LOCATION,
        y: y || this.HEIGHT_LOCATION,
        bitmap: "idea_book.book_open_" + frame,
        scale: scale,
      };
      IdeaUI.GUI.forceRefresh();
      return;
    }
  
    public static setOffset(x: int, y: int) {
      IdeaUI.GUI.content.elements["image"].x = x;
      IdeaUI.GUI.content.elements["image"].y = y;
      IdeaUI.GUI.forceRefresh();
      return;
    }
  
    public static drawSign(sign: string) {
      IdeaUI.GUI.content.elements["sign"] = {
        type: "image",
        bitmap: "sign." + sign,
        x: this.WIDTH_LOCATION + 25,
        y: this.HEIGHT_LOCATION + 110,
        scale: 9.7,
      };
      IdeaUI.GUI.forceRefresh();
    }
  
    public static clearSign() {
      IdeaUI.GUI.content.elements["sign"].bitmap = "unknown";
    }
  
    public static close() {
      IdeaUI.GUI.close();
    }
  
    public static open() {
      IdeaUI.setOffset(this.WIDTH_LOCATION, this.HEIGHT_LOCATION);
      IdeaUI.redrawImage(0, this.IMAGE_SCALE);
  
      IdeaUI.GUI.open();
    }
  
    public static initAnimation(sign: string | string[]) {
      
        if(!ConfigManager.IdeaAnimation) {
          return;
        };

      if (this.GUI.isOpened()) {
        return;
      }
      this.open();
  
      let x = this.WIDTH_LOCATION;
      let y = this.HEIGHT_LOCATION;
      let frame = 0;
      let timer = 0;
      let scale = this.IMAGE_SCALE;
      let alpha = 1;
      let timerMax = ([].concat(sign)).length;
  
      let signIndex = 0;
  
      Threading.initThread("thread.infinite_forest.idea_animation", () => {
        while (y < 1300) {
          if (frame < this.FRAME_MAX && timer <= 0) {
              frame++;
              IdeaUI.redrawImage(frame, this.IMAGE_SCALE);
              java.lang.Thread.sleep(50);
          }
          else {
              if (timer > timerMax && frame > 0) {
                  this.clearSign();
                  IdeaUI.redrawImage(frame--, this.IMAGE_SCALE);
                  java.lang.Thread.sleep(50);
              }
              ;
              if (timer <= timerMax) {
                  this.drawSign(Array.isArray(sign)
                      ? sign[signIndex]
                      : sign);
                  if (signIndex < sign.length - 1) {
                      signIndex++;
                  }
                  timer++;
                  java.lang.Thread.sleep(2000);
              }
              else if (frame <= 0) {
                  if (scale < 15) {
                      if (x < this.WIDTH_LOCATION * 2.8) {
                          IdeaUI.redrawImage(0, (scale -= 0.02), (x += 1), y);
                      }
                      else {
                          IdeaUI.redrawImage(0, scale, x, (y += 0.87));
                          if (y > 250) {
                              IdeaUI.GUI.layout.setAlpha(alpha -= 0.007);
                          }
                      }
                  }
                  else {
                      IdeaUI.redrawImage(0, (scale -= 0.3), x, (y += 0.2));
                      java.lang.Thread.sleep(1);
                  }
                  if (y >= 1300) {
                      this.close();
                      break;
                  }
              }
          }
      }
    });
    }
  
    static {
      this.GUI.setAsGameOverlay(true);
      this.GUI.setTouchable(false);
    }
  }
  
  Callback.addCallback("ItemUse", (c, i) => {
    if(i.id === VanillaItemID.charcoal) {
      IdeaUI.initAnimation(["snow", "fire", "forest", "question"])
    }
  })