new FItem("infinite_shark",1, "Infinite shark", ["infinity_fragment", 8, 1])

const CURSED_BLADE = new FItem("cursed_blade", 1, null, ["cursed_blade", 4, 1]);
CURSED_BLADE.setTool({
    durability: 1200, level: 2, efficiency: 3, damage: 12,
}, ToolType.sword);
CURSED_BLADE.registerHandFunction(iceItemProtectFunction);