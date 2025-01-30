class BlockList {
    public static FIRONIA: BlockPlant = new Fironia().create();
    public static ICE_FLOWER: BlockPlant = new IceFlower().create();
    public static ELECTRIC_MUSHROOM: BlockPlant = new ElectricMushroom().create();

    public static PINK_HEWN = new Hewn("pink_hewn");
    public static PINK_LOG = new Log("pink_log", this.PINK_HEWN.stringID);
    public static PINK_BARK = new Bark("pink_bark");
    public static PINK_PLANKS = new Planks("pink_planks", this.PINK_LOG.stringID, this.PINK_BARK.stringID, this.PINK_HEWN.stringID);

    public static EUCALYPTUS_HEWN = new Hewn("eucalyptus_hewn");
    public static EUCALYPTUS_LOG = new Log("eucalyptus_log", this.EUCALYPTUS_HEWN.stringID);
    public static EUCALYPTUS_BARK = new Bark("eucalyptus_bark");
    public static EUCALYPTUS_PLANKS = new Planks("eucalyptus_planks", this.EUCALYPTUS_LOG.stringID, this.EUCALYPTUS_BARK.stringID, this.EUCALYPTUS_HEWN.stringID);

    public static WINTER_HEWN = new Hewn("winter_hewn");
    public static WINTER_LOG = new Log("winter_log", this.WINTER_HEWN.stringID);
    public static WINTER_BARK = new Bark("winter_bark");
    public static WINTER_PLANKS = new Planks("winter_planks", this.WINTER_LOG.stringID, this.WINTER_BARK.stringID, this.WINTER_HEWN.stringID);

    public static WINDMILL_BLADES = new WindmillBlades().createWithRotation();
    public static WINDMILL_STATION = new WindmillStation().create();

    public static BOTTLE = new Bottle().create();
    public static FIREFLIES_BOTTLE = new FirefliesBottle().create();
}
