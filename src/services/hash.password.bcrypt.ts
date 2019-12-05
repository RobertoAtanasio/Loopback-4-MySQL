import { genSalt, hash, compare } from 'bcryptjs';
import { inject } from '@loopback/core';
import { Bindings } from '../keys';

// precisa fazer o export da interface PasswordHasher para se utilizar
// em keys.ts
export interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>;
  comparePassword(providedPass: T, storedPass: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {

  //--- encriptografar a senha informada

  // o @inject('rounds') abaixo está definido em application.ts
  // fazendo com que a variável rounds assuma o valor 10
  // @inject('services.hasher.rounds')

  @inject(Bindings.ROUNDS)
  public readonly rounds: number;
  async hashPassword(password: string) {
    const salt = await genSalt(this.rounds);
    return hash(password, salt);
  }

  //--- Verificar se as senhas conferem
  async comparePassword(
    providedPass: string,
    storedPass: string,
  ): Promise<boolean> {
    const passwordMatched = await compare(providedPass, storedPass);
    return passwordMatched;
  }
}
