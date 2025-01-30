class Factory<InputFormat extends Record<string, ItemInstance> | ItemInstance | number> {
    public field: { [result_id: number]: InputFormat } = {};

    public addRecipe(result: number, input: InputFormat): this {
        this.field[result] = input;
        return this;
    };

    public forEach(callback: (result: number, input: InputFormat) => void): void {
        for(const id in this.field) {
            callback(Number(id), this.field[id]);
        };
    };
};