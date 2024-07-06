interface IPageDescriptor {
    title: string,
    subtitle?: string,
  text: string;
  images?: {
    type: "item" | "default";
    x: int;
    y: int;
    scale: int;
    texture: string;
  }[];
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
}
