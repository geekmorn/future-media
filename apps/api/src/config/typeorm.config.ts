import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { UserEntity, TagEntity, PostEntity } from '../entities';

config({ path: '../../.env' });

const databaseUrl = process.env.DATABASE_URL;

const baseOptions = {
  entities: [UserEntity, TagEntity, PostEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: true,
};

const dataSourceOptions: DataSourceOptions = databaseUrl
  ? {
      type: 'postgres',
      url: databaseUrl,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      ...baseOptions,
    }
  : {
      type: 'better-sqlite3',
      database: process.env.DATABASE_PATH ?? 'database.sqlite',
      ...baseOptions,
    };

export default new DataSource(dataSourceOptions);
