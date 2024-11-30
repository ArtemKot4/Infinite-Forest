class CraftBuildLearning extends LearningBase<LearningType.CraftBuild> {
    public field: CraftField;

    public constructor(name: string, field: CraftField) {
       super(name);

       for(let i = 1; i <= 9; i++) {
           field["slot_" + i] ??= {id: 0, count: 0, data: 0};
       };

       this.field = field;

    };

      public static getPlayerItems(player: number) {

        const items = [];

          const actor = new PlayerActor(player);

           for(let i = 0; i < 36; i++) {

              items.push(new ItemStack(actor.getInventorySlot(i)));

          };

         return items;
         
      };

      public getType(): string {
        return "craft_build";
      };
}