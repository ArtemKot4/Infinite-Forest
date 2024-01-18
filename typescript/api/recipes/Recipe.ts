abstract class Recipe {
  public pool: any[] = [];
  public input_slots: int = 9;
  public slots: {} = {};
  /**
   * Метод для регистрации рецептов в формате:  
   * - {число: numberic id}
   */
  public registry(obj: {}) {
    const value = Object.values(obj);
    const key = Object.keys(obj);
    for (let i in key) {
      for (let k in value) {
        this.pool.push(`${key[i]}:${value[k]}`);
      }
    }
  };
  public initialize() {
    this.pool.forEach((item, index, array) => {
      const spl = item.split(":");
      for (let i = 1; i <= this.input_slots; i++) {
        this.slots["slot_" + i] = [];
        if (spl[0] == i) {
         
          this.slots["slot_" + i].push(spl[1]);
          continue;
        } else {throw new SyntaxError("Number is not valid! Please rewrite")}
      }
    });
  }
}

//new Recipe().registry({ 1: VanillaItemID.arrow });
