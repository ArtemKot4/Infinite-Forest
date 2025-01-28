declare namespace InfiniteDepth {
	/**
	 * Represent numeric or named dimension uid.
	 */
	type DimensionType = string | number;
	/**
	 * Height range bounds, determines minimum world level
	 * and relative height to it (does not depends on minimum).
	 */
	interface DimensionBounds {
		/**
		 * Minimum world level at which bedrock will be located.
		 * Negative values may cause minor world rendering issues,
		 * but they do not affect gameplay. Accepts values between
		 * -2048 and 2048.
		 */
		onset?: number;
		/**
		 * Height limit that is relative to starting coordinate.
		 * For example, if starting coordinate is -64 and world
		 * height is 384, then maximum building level will be 320.
		 */
		height: number;
	}
	/**
	 * Height range coordinates, determines minimum world level
	 * and absolute height limit (does depends on minimum).
	 */
	interface DimensionHeightRange {
		/**
		 * Minimum world coordinate that cannot be greater than
		 * upper level. Accepts values between -2048 and 2048.
		 */
		min?: number;
		/**
		 * Maximum world coordinate that cannot be less than
		 * lower level. Accepts values between -2048 and 2048.
		 */
		max: number;
	}
	/**
	 * Fixed minimum and maximum world coordinate array, which
	 * is represent {@link DimensionHeightRange} in most simple way.
	 */
	type DimensionHeightRangeArray = number[];
	/**
	 * Represent valid height range object types, which is
	 * used as {@link ConfigType} iterable.
	 */
	type DimensionConfigType = DimensionBounds | DimensionHeightRange | DimensionHeightRangeArray;
	/**
	 * Represent config object, which is used to easily configure
	 * multiple dimensions heights via {@link InfiniteDepth.fromJson}.
	 */
	type ConfigType = {
		[dimension: DimensionType]: DimensionConfigType;
	};
}

/**
 * Expand your world height to previously unseen limits!
 */
declare interface InfiniteDepth {
	/**
	 * Fetches dimension height ranges from present object.
	 * 
	 * @example
	 * ```ts
	 * InfiniteDepth.fromJson({
	 * 	// Could be vanilla overworld, nether or end
	 * 	"overworld": {
	 * 		// Minimum world level at which bedrock will be located
	 * 		"onset": -64,
	 * 		// Height limit that is relative to starting coordinate
	 * 		"height": 384
	 * 	},
	 * 	// Could be custom dimension uid, which is used when registration
	 * 	"aw_enchanted_forest": {
	 * 		// Onset or even minimum coordinate fallbacks to zero
	 * 		"height": 320
	 * 	},
	 * 	// Could be numeric dimension uid, which is always unique
	 * 	[InfiniteForest.id]: {
	 * 		"min": 0,
	 * 		"max": 512
	 * 	}
	 * });
	 * ```
	 */
	fromJson(json: InfiniteDepth.ConfigType): void;
	/**
	 * Fetches dimension height ranges from present config,
	 * that could be obtained as subvalue via {@link Config.get}.
	 * 
	 * @example
	 * ```ts
	 * // {
	 * 	// "enabled": true,
	 * 	// "heights": {
	 * 		// "overworld": {
	 * 			// height: 512
	 * 		// }
	 * 	// }
	 * // }
	 * 
	 * InfiniteForest.fromConfig(__config__.get("heights"));
	 * ```
	 */
	fromConfig(config: Config): void;
	/**
	 * Gets specific dimension minimum world coordinate, which
	 * can be used to manipulate with region and entities.
	 */
	getDimensionMinY(dimension: InfiniteDepth.DimensionType): number;
	/**
	 * Directly sets dimension height range coordinates, which will be
	 * changed when reentering dimension on server-side.
	 * @param min minimum world coordinate that cannot be greater than
	 * upper level, accepts values between -2048 and 2048
	 * @param max maximum world coordinate that cannot be less than
	 * lower level, accepts values between -2048 and 2048
	 */
	setDimensionHeightRange(dimension: InfiniteDepth.DimensionType, min: number, max: number): void;
	/**
	 * Directly sets dimension height range bounds, which will be
	 * changed when reentering dimension on server-side.
	 * @param onset minimum world level at which bedrock will be located,
	 * accepts values between -2048 and 2048
	 * @param height height limit that is relative to starting coordinate,
	 * accepts values between 0 and 512
	 */
	setDimensionBounds(dimension: InfiniteDepth.DimensionType, onset: number, height: number): void;
}

declare namespace ModAPI {
	function addAPICallback(apiName: "InfiniteDepth", func: (InfiniteDepth: InfiniteDepth) => void): void;
}
