const GenericUIDescriptor: UI.WindowContent = {
    location: {
      x: 0,
      y: 0,
      width: 1000,
      height: 560,
    },
    drawing: [
      {
        type: "background",
        color: android.graphics.Color.argb(0, 0, 0, 0),
      },
      {
        type: "bitmap",
        bitmap: "dialog_background",
        scale: 2.6,
        x: 50,
        y: 3,
      },
    ],
    style: {

    },
    elements: {
      heading: {
        type: "text",
        x: 170,
        y: 10,
        text: Translation.translate(
          "Standart text of all page category headings"
        ),
        clicker: {onLongClick(position, container) {
              container.close();
              alert("Контейнер закрыт!")
        }}
      },
      heading_2: {
        type: "text",
        x: 120,
        y: 50,
        text: Translation.translate(
          "Standart text of all page theme headings"
        ),
      },
      comment: {
        type: "text",
        x: 10,
        y: 90,
        text: Translation.translate("Its standart comment of all pages"),
        multiline: true,
      },
      description: {
        type: "text",
        x: 500,
        y: 90,
        text: Translation.translate("Its standart description of all pages"),
        multiline: true,
      }
    }
  
  }