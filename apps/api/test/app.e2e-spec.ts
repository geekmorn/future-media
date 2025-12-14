import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('/api/auth/sign-up (POST) - should fail with invalid data', () => {
      return request(app.getHttpServer())
        .post('/api/auth/sign-up')
        .send({ name: 'ab', password: '123' })
        .expect(400);
    });
  });

  describe('Posts', () => {
    it('/api/posts (GET) - should return posts list', () => {
      return request(app.getHttpServer())
        .get('/api/posts')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('items');
          expect(Array.isArray(res.body.items)).toBe(true);
        });
    });
  });

  describe('Tags', () => {
    it('/api/tags (GET) - should return tags list', () => {
      return request(app.getHttpServer())
        .get('/api/tags')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('items');
          expect(Array.isArray(res.body.items)).toBe(true);
        });
    });
  });
});
