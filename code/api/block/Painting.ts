// interface IRenderUtilModelBoxParams {
//     x1: number;
//     y1: number;
//     z1: number;
//     x2: number;
//     y2: number;
//     z2: number;
//     id?: number | [string, number][];
//     data?: number;
//     CONDITION?: ICRender.CONDITION;
// };

// interface IPaintingCoords {
// 	"background": IRenderUtilModelBoxParams;
// 	"canvas": IRenderUtilModelBoxParams;
// 	"frame_1": IRenderUtilModelBoxParams;
// 	"frame_2": IRenderUtilModelBoxParams;
// 	"frame_3": IRenderUtilModelBoxParams;
// 	"frame_4": IRenderUtilModelBoxParams;
// 	[key: string]: IRenderUtilModelBoxParams;
// }

// abstract class Painting<T = IPaintingCoords> extends BlockForest {
// 	public canRotate(): boolean {
// 		return true;
// 	};

//     abstract getModelCoords(): T;

//     public createModel(painting_texture: string): RenderUtil.Model {
//         const model = new RenderUtil.Model();
// 		const coords = this.getModelCoords();
		
//         for(const box_name in coords) {
// 			const box_description = coords[box_name] as IRenderUtilModelBoxParams;

// 			let texture = null;

// 			if(box_name.includes("canvas")) {
// 				texture = this.getID();
// 			} else {
// 				texture = box_description.id;
// 			};

// 			model.addBoxByBlock(
// 				box_name,
// 				box_description.x1, 
// 				box_description.y1, 
// 				box_description.z1, 
// 				box_description.x2, 
// 				box_description.y2, 
// 				box_description.z2, 
// 				texture
// 			);
//         };
//         return model;
//     };

// 	public constructor(painting_texture: string) {
// 		super("painting_" + painting_texture, [{
// 			inCreative: true,
// 			name: "block.infinite_forest.painting",
// 			texture: [[painting_texture, 0]]
// 		}]);

// 		const model = this.createModel(painting_texture);
// 		model.setBlockModel(this.getID());
// 	};
// };

// class Painting1x1 extends Painting {
//     public override getModelCoords(): IPaintingCoords {
// 		return {
// 			"canvas": {
// 				"x1": 15/16,
// 				"y1": 1/16,
// 				"z1": -3/32,
// 				"x2": 1,
// 				"y2": 15/16,
// 				"z2": -3/64
// 			},
// 			"background": {
// 				"x1": 1/16,
// 				"y1": 1/16,
// 				"z1": -1/16,
// 				"x2": 15/16,
// 				"y2": 15/16,
// 				"z2": -3/64,
// 				"id": BlockList.EUCALYPTUS_HEWN.id
// 			},
// 			"frame_1": {
// 				"x1": 0,
// 				"y1": 0,
// 				"z1": -3/64,
// 				"x2": 1,
// 				"y2": 1,
// 				"z2": 0,
// 				"id": BlockList.EUCALYPTUS_HEWN.id
// 			},
// 			"frame_2": {
// 				"x1": 0,
// 				"y1": 15/16,
// 				"z1": -3/32,
// 				"x2": 1,
// 				"y2": 1,
// 				"z2": -3/64,
// 				"id": BlockList.EUCALYPTUS_HEWN.id
// 			},
// 			"frame_3": {
// 				"x1": 0,
// 				"y1": 0,
// 				"z1": -3/32,
// 				"x2": 1,
// 				"y2": 1/16,
// 				"z2": -3/64,
// 				"id": BlockList.EUCALYPTUS_HEWN.id
// 			},
// 			"frame_4": {
// 				"x1": 0,
// 				"y1": 1/16,
// 				"z1": -3/32,
// 				"x2": 1/16,
// 				"y2": 15/16,
// 				"z2": -3/64,
// 				"id": BlockList.EUCALYPTUS_HEWN.id
// 			}
// 		};
//     };
// };