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

type pageDirection = Record<name, {
  texture?: string;
  content: pageContent & {learning?: string};
}>;


interface IPageDescriptor {
    /**
   * directions
   */
  directions?: pageDirection;
  left: pageContent;

  right: pageContent 

};