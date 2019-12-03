// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';
import { repository } from '@loopback/repository';
import { post, requestBody, getJsonSchemaRef, getModelSchemaRef } from '@loopback/rest';
import { User } from '../models';
import { UserRepository } from '../repositories';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
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
    }) user: User): Promise<User> {
    const savedUser = await this.userRepository.create(user);
    delete savedUser.password;
    return savedUser;
  }

}
