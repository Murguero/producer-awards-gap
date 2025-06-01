import { DataSource } from 'typeorm';
import { Movie } from '../infra/typeorm/entities/Movie';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'dev.sqlite',
  entities: [Movie],
  migrations: ['src/infra/typeorm/migrations/*.ts'],
  migrationsRun: true,
  dropSchema: true,
});

export default AppDataSource;
