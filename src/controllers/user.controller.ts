/* eslint-disable require-atomic-updates */
import { repository } from '@loopback/repository';
import {
  post,
  requestBody,
  getJsonSchemaRef,
  getModelSchemaRef,
  HttpErrors
} from '@loopback/rest';
import { User } from '../models';
import { UserRepository, Credentials } from '../repositories/user.repository';
import { validateCredentials } from '../services/validator';
import { BcryptHasher } from '../services/hash.password.bcrypt';
import { inject } from '@loopback/core';
import { CredentialsRequestBody } from './specs/user.controller.spec';
import { MyUserService } from '../services/user-service';
import { JWTService } from '../services/jwt-service';
import { Bindings } from '../keys';
import { get } from '@loopback/rest';
import { UserProfile, securityId } from '@loopback/security';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';

// o @inject abaixo está definido em application.ts

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    // @inject('services.hasher')
    @inject(Bindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,

    // @inject('services.user.service')
    @inject(Bindings.USER_SERVICE)
    public userService: MyUserService,

    // @inject('services.jwt.service')
    @inject(Bindings.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) { }

  @post('/signup', {
    responses: {
      '200': {
        description: 'Teste model instance',
        content: { 'application/json': { schema: getJsonSchemaRef(User) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'CadastroUsuario',
          }),
        },
      },
    }) userData: User): Promise<User> {

    validateCredentials(userData);

    //--- Método definido em: hash.password.bycrypt.ts
    const passw = await this.hasher.hashPassword(userData.password);
    userData.password = passw;
    console.log(userData);

    //--- Salvar usuário na base de dados retornando o usuário sem a senha
    const savedUser = await this.userRepository.create(userData);
    delete savedUser.password;
    return savedUser;
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{ token: string }> {
    // make sure user exist, password should be valid
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({ token });
  }

  // @get('/users/me')
  // @authenticate('jwt')
  // async me(
  //   @inject(AuthenticationBindings.CURRENT_USER)
  //   currentUser: UserProfile,
  // ): Promise<UserProfile> {
  //   let userProfile: UserProfile;
  //   try {
  //     userProfile = Object.assign(
  //       { [securityId]: '', name: '' },
  //       {
  //         [securityId]: 1,
  //         name: 'Haider Malik',
  //         id: 1,
  //       },
  //     );
  //   } catch (error) {
  //     throw new HttpErrors.Unauthorized(
  //       `Error na verificação do token : ${error.message}`,
  //     );
  //   }
  //   return Promise.resolve(userProfile);
  // }

  //--- obtendo o usuário corrente

  @get('/users/me')
  @authenticate('jwt')
  async me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<UserProfile> {
    return Promise.resolve(currentUser);
  }
}
