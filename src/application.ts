import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import * as path from 'path';
import { MySequence } from './sequence';
import { BcryptHasher } from './services/hash.password.bcrypt';
import { MyUserService } from './services/user-service';
import { JWTService } from './services/jwt-service';
import {
  Constants,
  Bindings,
} from './keys';

export class StarterApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    //set up bindings
    this.setupBinding();

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.bind(RestExplorerBindings.CONFIG).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  // TokenServiceBindings.TOKEN_SERVICE

  setupBinding(): void {
    this.bind(Bindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(Bindings.ROUNDS).to(Constants.ROUNDS);
    this.bind(Bindings.USER_SERVICE).toClass(MyUserService);
    this.bind(Bindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(Bindings.TOKEN_SECRET).to(Constants.TOKEN_SECRET_VALUE);
    this.bind(Bindings.TOKEN_EXPIRES_IN).to(Constants.TOKEN_EXPIRES_IN_VALUE);
  }

  // setupBinding(): void {
  //   this.bind('services.hasher').toClass(BcryptHasher);
  //   this.bind('services.hasher.rounds').to(10);
  //   this.bind('services.user.service').toClass(MyUserService);
  //   this.bind('services.jwt.service').toClass(JWTService);
  //   this.bind('authentication.jwt.secret').to('123asdf5');
  //   this.bind('authentication.jwt.expiresIn').to('7h');
  // }

}
