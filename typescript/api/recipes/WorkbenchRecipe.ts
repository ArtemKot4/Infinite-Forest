class WorkbenchRecipe extends Recipe {
  public slots: int[] = [];
  public result_recipe: Object[] = [];
  public isTrue: boolean = false;
  public registry(
    item: int,
    description: [first: string, second: string, third: string],
    obj: {}
  ): void {
    const list: ReadonlyArray<string[]> = [
      description[0].split(""),
      description[1].split(""),
      description[2].split(""),
    ];
    const obj_c: string[] = Object.keys(obj);
    const obj_v: string[] = Object.values(obj);
    for (const f in list) {
      for (const o in obj_c) {
        for (let r = 0; r <= 2; r++) { 
          if (list[f][r] == obj_c[o]) {
            const key: string = "index_" + f;
            this.result_recipe.push({ [key]: obj_v[o] });
             // * Номер положения элемента в сетке не сохраняется
          }
        }
      }
    }
  }
}

