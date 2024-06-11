export abstract class SocketOnlineIdsStorage {
  abstract signIn(userId: number, socketId: string): Promise<void>;
  abstract getSocketId(userId: number): Promise<string>;
  abstract signOut(userId: number): Promise<void>;
}
