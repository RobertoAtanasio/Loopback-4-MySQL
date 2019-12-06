/* eslint-disable require-atomic-updates */
import { BcryptHasher } from '../services/hash.password.bcrypt';
import { post, requestBody, getJsonSchemaRef, getModelSchemaRef } from "@loopback/rest";
import { validateCredentials } from "../services/validator";
import { User } from "../models";

import { Bindings } from '../keys';
import { repository } from '@loopback/repository';
import { inject } from '@loopback/core';
import { UserRepository } from '../repositories';
import { PermissionKeys } from '../authorization/permission-keys';

export class AdminController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    // @inject('services.hasher')
    @inject(Bindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,

  ) { }

  @post('/admin', {
    responses: {
      '200': {
        description: 'Gravar Usuário Admin',
        content: { 'application/json': { schema: getJsonSchemaRef(User) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'CadastroAdmin',
          }),
        },
      },
    }) admin: User): Promise<User> {

    validateCredentials(admin);

    admin.permissions = [
      PermissionKeys.CreateJob,
      PermissionKeys.UpdateJob,
      PermissionKeys.DeleteJob,
    ];

    //--- Método definido em: hash.password.bycrypt.ts
    const passw = await this.hasher.hashPassword(admin.password);
    admin.password = passw;
    console.log(admin);

    //--- Salvar usuário na base de dados retornando o usuário sem a senha
    const savedAdmin = await this.userRepository.create(admin);
    delete savedAdmin.password;
    return savedAdmin;
  }
}
