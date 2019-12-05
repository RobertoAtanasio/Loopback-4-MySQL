import { promisify } from 'util';
import { HttpErrors } from '@loopback/rest';
import { inject } from '@loopback/core';
import { Bindings } from '../keys';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

// cada @inject abaixo está definido em application.ts

export class JWTService {
  // @inject('authentication.jwt.secret')
  @inject(Bindings.TOKEN_SECRET)
  public readonly jwtSecret: string;

  // @inject('authentication.jwt.expiresIn')
  @inject(Bindings.TOKEN_EXPIRES_IN)
  public readonly jwtExpiresIn: string;

  async generateToken(userProfile: Object): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Erro ao gerar token: userprofile inválido',
      );
    }
    let token = '';
    try {
      token = await signAsync(userProfile, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn,
      });
    } catch (err) {
      throw new HttpErrors.Unauthorized(`Error na geração do token: ${err}`);
    }
    return token;
  }

  async verifyToken(token: string): Promise<Object> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }
    let userProfile: Object;
    try {
      // decode user profile from token
      const decryptedToken = await verifyAsync(token, this.jwtSecret);
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        { id: '', name: '' },
        { id: decryptedToken.id, name: decryptedToken.name },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }
}
