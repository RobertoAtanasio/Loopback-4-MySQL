// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';

import { repository } from '@loopback/repository';
import { StudentRepository } from '../repositories';
import { post, get, getModelSchemaRef, param, requestBody } from '@loopback/rest';
import { Address, Student } from '../models';

export class StudentAddressController {
  constructor(
    @repository(StudentRepository)
    public studentRepository: StudentRepository,
  ) { }

  @post('/students/{id}/address', {
    responses: {
      '200': {
        description: 'Endereço do Estudante',
        content: { 'application/json': { schema: getModelSchemaRef(Student) } },
      },
    },
  })
  async createAddress(
    @param.path.number('id') studentId: typeof Student.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Address, {
            title: 'NovoEnderecoEstudante'
          }),
        },
      },
    }) addressData: Omit<Student, 'id'>,
  ): Promise<Address> {
    return this.studentRepository.address(studentId).create(addressData);
  }

  @get('/students/{id}/address', {
    responses: {
      '200': { description: 'estudante com endereço' }
    }
  })
  async findById(
    @param.path.number('id') id: number
  ): Promise<Student> {
    return this.studentRepository
      .findById(id, { include: [{ relation: 'address' }] });
  }

  @get('/students/address', {
    responses: {
      '200': { description: 'estudantes com endereço' }
    }
  })
  async find(
    @param.query.number('limit') limit = 10
  ): Promise<Student[]> {
    return this.studentRepository.find({ limit, include: [{ relation: 'address' }] });
  }

  // @get('/students/{id}/address', {
  //   responses: {
  //     '200': {
  //       description: 'estudante com endereço',
  //       content: {
  //         'application/json': {
  //           schema: getModelSchemaRef(Student, { includeRelations: true }),
  //         }
  //       }
  //     }
  //   }
  // })
  // async findById(
  //   @param.path.number('id') id: number,
  //   @param.query.number('limit') limit = 10): Promise<Student> {
  //   if (limit > 100) limit = 100; // your logic
  //   // return this.studentRepository.find({limit, include: [{ relation: 'address' }]});
  //   return this.studentRepository.findById(id, { limit, include: [{ relation: 'address' }] });
  // }

}
