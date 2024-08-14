namespace Plants {
    class InsightEye extends Vine {
        public drop: boolean = false;
    }
    export const INSIGHT_EYE = new InsightEye("insight_eye", {
       base: {
       texture: "insight_eye_vine",   
       block_type: BLOCK_TYPE_PLANT
       },
       top: {
        texture: "insight_eye",
        block_type: "opaque"
       }
    });
    


setupBlockModel(
    BlockID["insight_eye_top"], {
    model: "insight_eye",
    texture: "insight_eye"
} 
);

BlockRegistry.setSoundType(BlockID["insight_eye_top"], "grass");
BlockRegistry.setDestroyLevel(BlockID["insight_eye_top"], -1);

 export const INSIGHT_EYE_ITEM = new FItem("insight_eye", 1).setInventoryModel("insight_eye", "insight_eye", {
    "scale": [0.9, 0.9, 0.9],
    "translate": [0.5, 0.25, 0.5],
    "invertV": false,
    "noRebuild": false
 }).setHandModel("insight_eye", "insight_eye", {
    "scale": [1.7, 1.7, 1.7],
    "translate": [0.3, 1, 2.5],
    "invertV": false,
    "noRebuild": false,
 },
 [0, 0, 0]);
};