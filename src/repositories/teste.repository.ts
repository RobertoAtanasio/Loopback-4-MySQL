import {DefaultCrudRepository} from '@loopback/repository';
import {Teste, TesteRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TesteRepository extends DefaultCrudRepository<
  Teste,
  typeof Teste.prototype.id,
  TesteRelations
> {
  constructor(
    @inject('datasources.Mysql') dataSource: MysqlDataSource,
  ) {
    super(Teste, dataSource);
  }
}
