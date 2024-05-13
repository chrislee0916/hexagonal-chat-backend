import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'chat',
  password: 'pass123',
  database: 'chat',
  synchronize: false,
  logging: true,
  entities: ['src/modules/**/infrastructure/persistence/orm/entities/*.ts'],
  migrations: ['src/migrations/*.ts'],
});
