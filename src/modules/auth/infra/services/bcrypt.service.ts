import bcrypt from 'bcrypt'
import { IPasswordHashService } from '../../domain/services'

export class BcryptPasswordHashService implements IPasswordHashService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }
}
