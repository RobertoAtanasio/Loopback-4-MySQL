import { BindingKey } from '@loopback/core';
import { PasswordHasher } from './services/hash.password.bcrypt';
import { JWTService } from './services/jwt-service';
import { UserService } from '@loopback/authentication';
import { User } from './models';
import { Credentials } from './repositories';

export namespace Constants {
  export const TOKEN_SECRET_VALUE = '123asdf5';
  export const TOKEN_EXPIRES_IN_VALUE = '7h';
  export const ROUNDS = 10;
}

export namespace Bindings {
  export const TOKEN_SECRET =
    BindingKey.create<string>('authentication.jwt.secret');

  export const TOKEN_EXPIRES_IN =
    BindingKey.create<string>('authentication.jwt.expiresIn');

  export const TOKEN_SERVICE =
    BindingKey.create<JWTService>('services.jwt.service');

  export const PASSWORD_HASHER =
    BindingKey.create<PasswordHasher>('services.hasher');

  export const ROUNDS =
    BindingKey.create<number>('services.hasher.rounds');

  export const USER_SERVICE =
    BindingKey.create<UserService<User, Credentials>>('services.user.service');
}
