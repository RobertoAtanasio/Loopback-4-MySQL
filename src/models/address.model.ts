import { Entity, model, property, belongsTo } from '@loopback/repository';
import { Student, StudentWithRelations } from './student.model';

@model()
export class Address extends Entity {
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
  city: string;

  @property({
    type: 'string',
  })
  zip?: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @belongsTo(() => Student)
  studentId: number;

  constructor(data?: Partial<Address>) {
    super(data);
  }
}

export interface AddressRelations {
  // describe navigational properties here
  student?: StudentWithRelations;
}

export type AddressWithRelations = Address & AddressRelations;
