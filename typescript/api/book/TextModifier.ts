type modifier_func = (
  container: UI.Container,
  data: string,
  index: universal,
  key: string,
  result: string,
  ...any
) => void;

class TextModifier {
  public static data: {} = {};
  constructor(name, logic: modifier_func) {
    TextModifier.data[name] = { logic: logic, result: "" };
  }
  public static setModifier(container, data, index, key, modifier) {
    const data_ = data[index][key];
    const modifier_ = data_["modifier"]; // {"1": {modifier: type}}
    const ModifierData = TextModifier.data[modifier];
    if (typeof data_ === "object" && modifier_ && modifier_ == ModifierData)
      ModifierData.logic(container, data_, index, key, ModifierData.result);
  }
}

new TextModifier("typewriter", (container, data, index, key, result) => {
  //TODO: data = data[index][key];
  let separator = data.split("");
  if (separator.length > 0) result += separator[0];
  separator.shift();
  return container.setText(key, result);
});
