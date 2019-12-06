import { promisify } from 'util';
import { HttpErrors } from '@loopback/rest';
import { inject } from '@loopback/core';
import { Bindings } from '../keys';

import { UserProfile, securityId } from '@loopback/security';

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

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Erro ao gerar token: userProfile inválido',
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

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Erro na verificação do Token: 'token' is null`,
      );
    }
    let userProfile: UserProfile;
    try {
      // decode user profile from token
      const decryptedToken = await verifyAsync(token, this.jwtSecret);
      // don't copy over  token field 'iat' and 'exp', nor 'email' to user profile
      userProfile = Object.assign(
        { [securityId]: '', name: '', permissions: [] },
        {
          [securityId]: decryptedToken.id,
          name: decryptedToken.name,
          id: decryptedToken.id,
          permissions: decryptedToken.permissions,
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error na verificação do token : ${error.message}`,
      );
    }
    return userProfile;
  }

}
