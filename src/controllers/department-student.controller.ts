import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Department,
  Student,
} from '../models';
import {DepartmentRepository} from '../repositories';

export class DepartmentStudentController {
  constructor(
    @repository(DepartmentRepository) protected departmentRepository: DepartmentRepository,
  ) { }

  @get('/departments/{id}/students', {
    responses: {
      '200': {
        description: 'Array of Student\'s belonging to Department',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Student)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Student>,
  ): Promise<Student[]> {
    return this.departmentRepository.students(id).find(filter);
  }

  @post('/departments/{id}/students', {
    responses: {
      '200': {
        description: 'Department model instance',
        content: {'application/json': {schema: getModelSchemaRef(Student)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Department.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {
            title: 'NewStudentInDepartment',
            exclude: ['id'],
            optional: ['departmentId']
          }),
        },
      },
    }) student: Omit<Student, 'id'>,
  ): Promise<Student> {
    return this.departmentRepository.students(id).create(student);
  }

  @patch('/departments/{id}/students', {
    responses: {
      '200': {
        description: 'Department.Student PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {partial: true}),
        },
      },
    })
    student: Partial<Student>,
    @param.query.object('where', getWhereSchemaFor(Student)) where?: Where<Student>,
  ): Promise<Count> {
    return this.departmentRepository.students(id).patch(student, where);
  }

  @del('/departments/{id}/students', {
    responses: {
      '200': {
        description: 'Department.Student DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Student)) where?: Where<Student>,
  ): Promise<Count> {
    return this.departmentRepository.students(id).delete(where);
  }
}
