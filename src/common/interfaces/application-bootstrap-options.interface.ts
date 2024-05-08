import { DatabaseType } from 'typeorm';

export interface ApplicationBootstrapOptions {
  driver: 'orm';
  type: DatabaseType;
}
