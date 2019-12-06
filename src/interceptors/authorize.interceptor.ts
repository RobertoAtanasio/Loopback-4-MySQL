import {
  /* inject, */
  globalInterceptor,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
  inject,
  Getter,
} from '@loopback/context';
import {
  AuthenticationBindings,
  AuthenticationMetadata
} from '@loopback/authentication';
import {
  RequiredPermissions,
  MyUserProfile
} from './../types';
import { intersection } from 'lodash';
import { HttpErrors } from '@loopback/rest';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', { tags: { name: 'authorize' } })
export class AuthorizeInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata,

    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<MyUserProfile>
  ) { }

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   * This method will be called for every request.
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {

    // eslint-disable-next-line no-useless-catch
    try {
      /**
       * Exemplo do this.metadata:
       * { strategy: 'jwt', options: { required: [ 'CreateJob' ] } }
       */

      // if you will not provide options in your @authenticate decorator
      // this line will be executed
      if (!this.metadata) return await next();

      // RequiredPermissions está definido em types.ts
      const result = await next();
      const requiredPermissions = this.metadata.options as RequiredPermissions;
      /**
       * Exemplo do requiredPermissions acima:
       * { required: [ 'CreateJob' ] }
       */

      const user = await this.getCurrentUser();

      /*
      Exemplo dos displays de:

      this.metadata ->
          { strategy: 'jwt', options: { required: [ 'CreateJob' ] } }

      requiredPermissions ->
          { required: [ 'CreateJob' ] }

      User ->
          {
            name: 'Admin Sistema',
            permissions: [ 'CreateJob', 'UpdateJob', 'DeleteJob' ],
            id: 28,
            [Symbol(securityId)]: 28
          }
      User Permissions ->
          [ 'CreateJob', 'UpdateJob', 'DeleteJob' ]
      */

      const results = intersection(
        user.permissions,
        requiredPermissions.required,
      ).length;
      if (results !== requiredPermissions.required.length) {
        throw new HttpErrors.Forbidden('Permissão de Acesso Inválida.');
      }

      // Add post-invocation logic here
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }

  }
}
