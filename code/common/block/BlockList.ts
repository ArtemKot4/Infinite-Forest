namespace BlockList {
    export const FIRONIA = new Fironia();
    export const ICE_FLOWER = new IceFlower();
    export const ELECTRIC_MUSHROOM = new ElectricMushroom();
    export const BLUE_MUSHROOM_BLOCK = new BlueMushroomBlock();

    export const PINK_HEWN = new Hewn("pink_hewn");
    export const PINK_LOG = new Log("pink_log", PINK_HEWN.stringID);
    export const PINK_BARK = new Bark("pink_bark", PINK_LOG.stringID);
    export const PINK_PLANKS = new Planks("pink_planks", PINK_LOG.stringID, PINK_BARK.stringID, PINK_HEWN.stringID);

    export const EUCALYPTUS_HEWN = new Hewn("eucalyptus_hewn");
    export const EUCALYPTUS_LOG = new Log("eucalyptus_log", EUCALYPTUS_HEWN.stringID);
    export const EUCALYPTUS_BARK = new Bark("eucalyptus_bark", EUCALYPTUS_LOG.stringID);
    export const EUCALYPTUS_PLANKS = new Planks("eucalyptus_planks", EUCALYPTUS_LOG.stringID, EUCALYPTUS_BARK.stringID, EUCALYPTUS_HEWN.stringID);

    export const WINTER_HEWN = new Hewn("winter_hewn");
    export const WINTER_LOG = new Log("winter_log", WINTER_HEWN.stringID);
    export const WINTER_BARK = new Bark("winter_bark", WINTER_LOG.stringID);
    export const WINTER_PLANKS = new Planks("winter_planks", WINTER_LOG.stringID, WINTER_BARK.stringID, WINTER_HEWN.stringID);

    export const WINDMILL_BLADES = new WindmillBlades();
    export const WINDMILL_STATION = new WindmillStation();

    export const LEARNING_TABLE = new LearningTable();

    export const BOTTLE = new Bottle();
    export const FIREFLIES_BOTTLE = new FirefliesBottle();
    
    export const CAULDRON = new Cauldron();
    export const SALT = new Salt();

    export const EUCALYPTUS_TORCH = new EucalyptusTorchUnlit();
    //export const CANDLE = new Candle();
};
