import { DataSource, DataSourceOptions } from 'typeorm';
import entities from '../../entities';
import appConfig from './app-conf';

const config = appConfig();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.database,
  host: config.database.host,
  migrations: ['migrations/**/*.ts', 'migrations/**/*.js'],
  entities: entities,
};

export default new DataSource(dataSourceOptions);
