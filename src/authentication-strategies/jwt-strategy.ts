import { AuthenticationStrategy } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import { Request, HttpErrors } from '@loopback/rest';
import { inject } from '@loopback/core';
import { Bindings } from '../keys';
import { JWTService } from '../services/jwt-service';

export class JWTStrategy implements AuthenticationStrategy {

  constructor(
    @inject(Bindings.TOKEN_SERVICE)
    public jwtService: JWTService,
  ) { }

  name = 'jwt';

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    const userProfile: UserProfile = await this.jwtService.verifyToken(token);
    return userProfile;
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header is missing');
    }

    const authHeaderValue = request.headers.authorization;

    // authorization  : Bearer xxxc..yyy..zzz
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(`
      Authorization header is not type of 'Bearer'.
      `);
    }

    //split the string into 2 parts : 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized(`
     Authorization header has too many parts it must follow this pattern 'Bearer xx.yy.zz' where xx.yy.zz should be valid token
    `);
    }
    const token = parts[1];
    return token;
  }
}
