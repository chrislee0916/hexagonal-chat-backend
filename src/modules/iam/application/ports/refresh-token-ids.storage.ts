import { Tokens } from '../../domain/interfaces/tokens.interface';
import { User } from '../../domain/user';

export abstract class RefreshTokenIdsStorage {
  abstract insert(userId: number, tokenId: string): Promise<void>;
  abstract validate(userId: number, tokenId: string): Promise<boolean>;
  abstract invalidate(userId: number): Promise<void>;
  abstract generateTokens(user: User): Promise<Tokens>;
}
