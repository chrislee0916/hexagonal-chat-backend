import { compare, genSalt, hash } from 'bcrypt';
import { HashingService } from 'src/modules/iam/application/ports/hashing.service';

export class BcryptService implements HashingService {
  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt();
    return hash(data, salt);
  }
  compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }
}
