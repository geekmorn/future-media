import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserEntity, TagEntity, PostEntity } from '../entities';

config({ path: '.env' });
config({ path: '../../.env' });

export default new DataSource({
  type: 'better-sqlite3',
  database: process.env.DATABASE_PATH ?? 'database.sqlite',
  entities: [UserEntity, TagEntity, PostEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: true,
});
