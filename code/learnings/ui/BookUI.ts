namespace Book {
  export interface ISectionList {
    default: {
      pages: string[];
    };
    cauldron: {
      pages: string[];
    };
    sign: {
      pages: string[];
    };
  }

  export abstract class MainUI {
    protected static page = 0;

    protected constructor() {}

    protected static content = {
      drawing: [
        {
          type: "background",
          color: android.graphics.Color.argb(38, 22, 22, 22),
        },
        {
          type: "bitmap",
          bitmap: "book.learning_book_background",
          x: UI.getScreenHeight() / 3,
          y: 30,
          scale: 2,
        },
      ],
      elements: {
        closeButton: {
          type: "closeButton",
          x: UI.getScreenHeight() - 274,
          y: 90,
          scale: 1.9,
          bitmap: "close_button",
        },
        buttonRight: {
          type: "button",
          x: UI.getScreenHeight() * 1.5,
          y: 372.5,
          scale: 3,
          bitmap: "book.right_button",
          bitmap2: "book.right_button_pressed",
          clicker: {
            onClick: () => {},
          },
        },
        buttonLeft: {
          type: "button",
          x: UI.getScreenHeight() / 1.75,
          y: 372.5,
          scale: 3,
          bitmap: "book.left_button",
          bitmap2: "book.left_button_pressed",
          clicker: {
            onClick: () => {},
          },
        },

        number1: {
          type: "text",
          x: UI.getScreenHeight() / 1.35,
          y: 375,
          font: {
            size: 15,
            color: android.graphics.Color.parseColor("#B8AC8F"),
          },
          text: ERROR_WARNING,
        },
        number2: {
          type: "text",
          x: UI.getScreenHeight() * 1.35,
          y: 375,
          font: {
            size: 15,
            color: android.graphics.Color.parseColor("#B8AC8F"),
          },
          text: ERROR_WARNING,
        },
      },
    } as UI.WindowContent;

    protected static UI = new UI.Window(this.content);

    public static getUI(): UI.Window {
      return MainUI.UI;
    }

    protected static getButtonContentForPage(page: int = 0) {
      const content = MainUI.content;

      const defaultContent = {
          buttonRight: content.elements.buttonRight,
          buttonLeft: content.elements.buttonLeft,
      };

      if (page > 0) {
        defaultContent.buttonLeft.clicker.onClick = () => {
          page--;
          MainUI.drawForPage(page, Section.current);
        };

        defaultContent.buttonRight.clicker.onClick = () => {
          page++;
          MainUI.drawForPage(page, Section.current);
        };
      };

      return {defaultContent, page}
    }

    public static drawForPage(page: int = 0, section: string = "default") {
      const buttonContent = MainUI.getButtonContentForPage(page);
      
      page = buttonContent.page

      const defaultContent = { ...MainUI.content };

      const player = Player.getLocal();

      const currentPage =
        ServerPlayer.getFlagFromServer(player, "pages", [])[page] ??
        ServerPlayer.getFlag(player, "pages", []);

      const pageContent = Page.getPage(currentPage);

      if (pageContent === null) return;

      const resultContent = {elements: buttonContent.defaultContent, ...defaultContent, ...pageContent, };

      MainUI.UI.setContent(resultContent);
      MainUI.UI.forceRefresh();
    }

    public static openFor(player: int) {
      MainUI.drawForPage(0);
    };

    static {
      MainUI.UI.setCloseOnBackPressed(true);
      MainUI.UI.setBlockingBackground(true);
    }
  }

  /*
  export abstract class GraphicUIDeprecated {
    public static pagesList: Record<playerName, ISectionList> = {};
    protected constructor() {}
    protected static content = {
      drawing: [
        {
          type: "background",
          color: android.graphics.Color.argb(38, 22, 22, 22),
        },
        {
          type: "bitmap",
          bitmap: "book.learning_book_background",
          x: UI.getScreenHeight() / 3,
          y: 30,
          scale: 2,
        },
      ],
      elements: {
        closeButton: {
          type: "closeButton",
          x: UI.getScreenHeight() - 274,
          y: 90,
          scale: 1.9,
          bitmap: "close_button",
        },
        buttonRight: {
          type: "button",
          x: UI.getScreenHeight() * 1.5,
          y: 372.5,
          scale: 3,
          bitmap: "book.right_button",
          bitmap2: "book.right_button_pressed",
          clicker: {
            onClick: () => GraphicUI.rightOnClick,
          },
        },
        buttonLeft: {
          type: "button",
          x: UI.getScreenHeight() / 1.75,
          y: 372.5,
          scale: 3,
          bitmap: "book.left_button",
          bitmap2: "book.left_button_pressed",
          clicker: {
            onClick: () => GraphicUI.leftOnClick,
          },
        },

        number1: {
          type: "text",
          x: UI.getScreenHeight() / 1.35,
          y: 375,
          font: {
            size: 15,
            color: android.graphics.Color.parseColor("#B8AC8F"),
          },
          text: ERROR_WARNING,
        },
        number2: {
          type: "text",
          x: UI.getScreenHeight() * 1.35,
          y: 375,
          font: {
            size: 15,
            color: android.graphics.Color.parseColor("#B8AC8F"),
          },
          text: ERROR_WARNING,
        },
      },
    } as UI.WindowContent;

    protected static getButtonsContentFor(section: keyof ISectionList) {
      section ??= Section.getCurrent();

      const buttonLeft = { ...GraphicUI.UI.content.elements.buttonLeft };
      const buttonRight = { ...GraphicUI.UI.content.elements.buttonRight };

      buttonLeft.clicker.onClick = GraphicUI.leftOnClick.bind({}, section);
      buttonRight.clicker.onClick = GraphicUI.rightOnClick.bind({}, section);

      return {
        buttonLeft,
        buttonRight,
      };
    }

    protected static drawPageNumbers(section?: keyof ISectionList) {
      const content = GraphicUI.UI.getContent();
      const index = GraphicUI.findPageIndex(section);

      content.elements["number1"].text = index.toString();
      content.elements["number2"].text = (index + 1).toString();
    }

    protected static findPageIndex(section?: keyof ISectionList) {
      const playerName = Entity.getNameTag(Player.getLocal());
      const pageList = this.getPagesFor(playerName, section);

      const index = pageList.findIndex((v) =>
        (GraphicUI.UI.content.elements["leftTitle"].text as string).includes(
          Translation.translate(v)
        )
      );

      return index;
    }

    protected static buttonFlip(section: keyof ISectionList, pageNumber: int) {
      return GraphicUI.updateFor(section, pageNumber);
    }

    protected static rightOnClick(section: keyof ISectionList) {
      return GraphicUI.buttonFlip(
        section,
        GraphicUI.findPageIndex(section) + 1
      );
    }

    protected static leftOnClick(section: keyof ISectionList) {
      return GraphicUI.buttonFlip(
        section,
        GraphicUI.findPageIndex(section) - 1
      );
    }

    public static UI = new UI.Window(GraphicUI.content as UI.WindowContent);

    public static setContent(
      section?: keyof ISectionList,
      pageNumber: int = 0
    ) {
      const playerName = Entity.getNameTag(Player.getLocal());
      const existingContent =
        BookPage.resultPages[GraphicUI.getPagesFor(playerName)[pageNumber]];
      const concatedElements = Object.assign(
        {},
        GraphicUI.content.elements,
        GraphicUI.getButtonsContentFor(section),
        existingContent.elements
      );

      const concatedDrawings = []
        .concat(GraphicUI.content.drawing)
        .concat(existingContent.drawing);

      const content = GraphicUI.UI.getContent();
      content.elements = concatedElements; //
      content.drawing = concatedDrawings;
      //{ elements: , drawing:  };
      //GraphicUI.UI.setContent(

      // as UI.WindowContent
      //)

      GraphicUI.drawPageNumbers(section);
      GraphicUI.UI.forceRefresh();
    }

    @onLevelDisplayed
    public static initializeSections() {
      const players = Network.getConnectedPlayers();

      for (const i in players) {
        const name = Entity.getNameTag(players[i]);

        const data = (GraphicUI.pagesList[name] ??= {} as ISectionList);

        for (const section of Object.keys(Section.list)) {
          if (!data[section]) {
            data[section] = {
              pages: [],
            };
          }
        }

        if (data.default.pages.length === 0) {
          data.default.pages.push("main_title");
        }

        Game.message(JSON.stringify(Book.GraphicUI.pagesList[name])); //TODO: DEBUG
      }
    }

    public static getPagesFor(
      playerName: string,
      section?: keyof ISectionList
    ): name[] {
      Game.message(
        JSON.stringify(
          GraphicUI.pagesList[playerName][section || Section.getCurrent()]
        )
      ); //TODO: DELETE DEBUG MESSAGE

      return GraphicUI.pagesList[playerName][section || Section.getCurrent()]
        .pages;
    }

    public static openFor(player: int) {
      const playerName = Entity.getNameTag(player);

      Section.initSectionButtons(playerName);

      GraphicUI.setContent();
      GraphicUI.UI.open();
    }

    public static updateFor(section: keyof ISectionList, pageNumber: int) {
      Section.setCurrent(section);
      GraphicUI.setContent(section, pageNumber);
    }

    static {
      GraphicUI.UI.setCloseOnBackPressed(true);
      GraphicUI.UI.setBlockingBackground(true);
    }
  }
}
*/