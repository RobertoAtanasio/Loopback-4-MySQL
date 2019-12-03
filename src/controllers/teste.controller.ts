import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Teste} from '../models';
import {TesteRepository} from '../repositories';

export class TesteController {
  constructor(
    @repository(TesteRepository)
    public testeRepository : TesteRepository,
  ) {}

  @post('/teste', {
    responses: {
      '200': {
        description: 'Teste model instance',
        content: {'application/json': {schema: getModelSchemaRef(Teste)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Teste, {
            title: 'NewTeste',
            
          }),
        },
      },
    })
    teste: Teste,
  ): Promise<Teste> {
    return this.testeRepository.create(teste);
  }

  @get('/teste/count', {
    responses: {
      '200': {
        description: 'Teste model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Teste)) where?: Where<Teste>,
  ): Promise<Count> {
    return this.testeRepository.count(where);
  }

  @get('/teste', {
    responses: {
      '200': {
        description: 'Array of Teste model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Teste, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Teste)) filter?: Filter<Teste>,
  ): Promise<Teste[]> {
    return this.testeRepository.find(filter);
  }

  @patch('/teste', {
    responses: {
      '200': {
        description: 'Teste PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Teste, {partial: true}),
        },
      },
    })
    teste: Teste,
    @param.query.object('where', getWhereSchemaFor(Teste)) where?: Where<Teste>,
  ): Promise<Count> {
    return this.testeRepository.updateAll(teste, where);
  }

  @get('/teste/{id}', {
    responses: {
      '200': {
        description: 'Teste model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Teste, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.query.object('filter', getFilterSchemaFor(Teste)) filter?: Filter<Teste>
  ): Promise<Teste> {
    return this.testeRepository.findById(id, filter);
  }

  @patch('/teste/{id}', {
    responses: {
      '204': {
        description: 'Teste PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Teste, {partial: true}),
        },
      },
    })
    teste: Teste,
  ): Promise<void> {
    await this.testeRepository.updateById(id, teste);
  }

  @put('/teste/{id}', {
    responses: {
      '204': {
        description: 'Teste PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() teste: Teste,
  ): Promise<void> {
    await this.testeRepository.replaceById(id, teste);
  }

  @del('/teste/{id}', {
    responses: {
      '204': {
        description: 'Teste DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.testeRepository.deleteById(id);
  }
}
