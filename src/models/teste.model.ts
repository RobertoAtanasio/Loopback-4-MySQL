import {Entity, model, property} from '@loopback/repository';

@model()
export class Teste extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
  })
  lastName?: string;


  constructor(data?: Partial<Teste>) {
    super(data);
  }
}

export interface TesteRelations {
  // describe navigational properties here
}

export type TesteWithRelations = Teste & TesteRelations;
