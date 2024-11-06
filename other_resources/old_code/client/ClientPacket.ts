abstract class ClientPacket {
  protected constructor() {}
  static identifier: string;
  static action: (data: [] | {}) => any;
//   static {
//     this.identifier && Network.addClientPacket(this.identifier, this.action);
//   }
}
