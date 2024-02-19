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
      bitmap: "book.dialog_background",
      scale: 2.3,
      x: 75,
      y: 5,
    },
  ],
  style: {},
  elements: {
    category: {
      type: "text",
      x: 10,
      y: 10,
      text: Translation.translate(
        "Standart text of all page category headings"
      ),
      clicker: {
        onLongClick(position, container) {
          container.close();
          alert("Контейнер закрыт!");
        },
      },
    },
    heading: {
      type: "text",
      x: 450,
      y: 10,
      text: Translation.translate("Standart text of all page theme headings"),
    },
    comment: {
      type: "text",
      x: 40,
      y: 90,
      text: Translation.translate("Its standart comment of all pages"),
      multiline: true,
    },
    description: {
      type: "text",
      x: 450,
      y: 100,
      text: Translation.translate("Its standart description of all pages"),
      multiline: true,
    },
    page: { type: "text", x: 825, y: 370, text: "page" },
    array_left: {
      type: "button",
      x: 40,
      y:390,
      clicker: {
        onClick(position, container, tileEntity, window, canvas, scale) {
          const data = Book.data;
          if (data.page > 0) data.page -= 1;
        },
      },
      array_right: {
        type: "button",
        x: 450,
        y: 390,
        clicker: {
          onClick(position, container, tileEntity, window, canvas, scale) {
            const data = Book.data;
            if (data.page < data.max) data.page += 1;
          },
        },
      },
    },
  },
};
