import { DataSource } from 'typeorm';
import { Movie } from '../infra/typeorm/entities/Movie';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [Movie],
  migrations: ['src/infra/typeorm/migrations/*.ts'],
  migrationsRun: true,
  dropSchema: true,
});

export default AppDataSource;
