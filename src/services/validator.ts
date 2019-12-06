import * as EmailValidator from 'email-validator';
import { HttpErrors } from '@loopback/rest';
import { Credentials } from "../repositories";

export function validateCredentials(credentials: Credentials) {
  if (!EmailValidator.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('Email inválido');
  }

  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'O tamanho da senha deve ser maior ou igual a 8',
    );
  }
}
