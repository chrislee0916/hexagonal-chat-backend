export abstract class SocketOnlineIdsStorage {
  abstract signIn(userId: number, socketId: string): Promise<void>;
  abstract getSocketId(userId: number): Promise<string>;
  abstract getUserId(socketId: string): Promise<string>;
  abstract signOut(socketId: string): Promise<void>;
}
