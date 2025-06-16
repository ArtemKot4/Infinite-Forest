class Factory {
    public field: { result: ItemInstance, input: ItemInstance[], tags?: Record<string, any> }[] = [];

    public registerRecipe(result: ItemInstance, input: ItemInstance[], tags?: Record<string, unknown>): this {
        this.field.push({
            result: result,
            input: input,
            tags: tags
        });
        return this;
    }

    public forEach(callback: (field: typeof Factory.prototype.field[number]) => void): void {
        for(const id in this.field) {
            callback(this.field[id]);
        }
        return;
    }

    public registerFromPath(path: string): this {
        const files = FileTools.GetListOfFiles(path, "");
        for(const i in files) {
            const object = JSON.parse(FileTools.ReadText(files[i].getAbsolutePath()));
            object.result.id = IDRegistry.parseID(object.result.id);
            object.result.count = object.result.count || 1;
            object.result.data = object.result.data || 0;
            for(const j in object.input) {
                object.input[j].id = IDRegistry.parseID(object.input[j].id);
                object.input[j].count = object.input[j].count || 1;
                object.input[j].data = object.input[j].data || 0;
            }
            this.field.push(object);
        }
        alert(JSON.stringify(this.field));
        return this;
    }
}