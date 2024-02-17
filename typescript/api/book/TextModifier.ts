type modifier_func = (
    container: UI.Container,
    data: string,
    index: universal,
    key: string,
    result: string,
    ...any
  ) => void;

class TextModifier {
  public name: string;
  public func: Function;
  public result: string = "";
  constructor(
    name,
    logic: modifier_func
  ) {
    this.name = name;
    this.func = logic;
  }
  setLogic(container, data, index, key) {
    const data_ = data[index][key];
    const modifier = data_["modifier"];
    if (typeof data_ === "object" && modifier && modifier == this.name)
      this.func(container, data_, index, key, this.result);
  }
}

new TextModifier("slowly_typing",
 (container, data, index, key, result) => {
  //data = data[index][key];
  let separator = data.split("");
  if (separator.length > 0) result += separator[0];
  separator.shift();
  return container.setText(key, result);
});
