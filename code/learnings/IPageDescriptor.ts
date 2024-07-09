type pageElements = {
  title: string;
  subtitle?: string;
  text: string;
};

type pageImage = {
  type: "item" | "default";
  x: int;
  y: int;
  scale: int;
  texture: string;
};

type pageContent = {
  elements: pageElements;
  images?: pageImage[];
};

type pageDirection = {
  name: string;
  texture: string;
  content: pageContent;
};


interface IPageDescriptor {
  left: pageContent;
  /**
   * directions can't be used if you use a right page
   */
  right: pageContent & {
    directions?: {
      first: pageDirection;
      second?: pageDirection;
      third?: pageDirection;
    };
  };
};