
import { UserService } from '@loopback/authentication';
import { repository } from '@loopback/repository';
import { UserRepository, Credentials } from '../repositories';
import { inject } from '@loopback/core';
import { BcryptHasher } from './hash.password.bcrypt';
import { User } from '../models';
import { HttpErrors } from '@loopback/rest';
import { Bindings } from '../keys';
import { UserProfile, securityId } from '@loopback/security';

// 'service.hasher' definido em application.ts função setupBinding

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    // @inject('services.hasher')
    @inject(Bindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) { }
  async verifyCredentials(credentials: Credentials): Promise<User> {

    //--- Verificar se o usuário existe
    // const foundUser = await this.getUser(credentials);

    //--- Verificar se o usuário existe
    const foundUser = await this.userRepository.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (!foundUser) {
      throw new HttpErrors.NotFound(
        `Usuário não encontrado com este email: ${credentials.email}`,
      );
    }

    //--- Verificar se a senha está válida
    //    Método definido em: hash.password.bycrypt.ts
    const passwordMatched = await this.hasher.comparePassword
      (credentials.password, foundUser.password);
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Senha inválida!');
    }
    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    // since first name and lastName are optional, no error is thrown if not provided
    let userName = '';
    if (user.firstName) userName = `${user.firstName}`;
    if (user.lastName)
      userName = user.firstName
        ? `${userName} ${user.lastName}`
        : `${user.lastName}`;
    let userProfile: UserProfile;
    try {
      userProfile = Object.assign(
        { [securityId]: '', name: '' },
        {
          [securityId]: user.id,
          name: userName,
          id: user.id,
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error na verificação do token : ${error.message}`,
      );
    }
    return userProfile;
  }

  // async getUser(credentials: Credentials): Promise<User> {
  //   //--- Verificar se o usuário existe
  //   const foundUser = await this.userRepository.findOne({
  //     where: {
  //       email: credentials.email,
  //     },
  //   });
  //   if (!foundUser) {
  //     throw new HttpErrors.NotFound(
  //       `Usuário não encontrado com este email: ${credentials.email}`,
  //     );
  //   }
  //   return foundUser;
  // }
}
