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
}
interface IPageContent {
  elements: pageElements
  images?: pageImage[];
};

interface IPageDescriptor {
  left: IPageContent
  right: IPageContent & {
    directions?: {
      first: {
        name: string;
        texture: string;
        text: string;
      };
      second?: {
        name: string;
        texture: string;
        text: string;
      };
      third?: {
        name: string;
        texture: string;
        text: string;
      };
    };
  };
}
