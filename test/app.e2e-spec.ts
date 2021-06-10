import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from './mongoTestUtil';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, rootMongooseTestModule()],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()) // 👈
      .get('/')
      .set('Authorization', process.env.API_KEY) // 👈
      .expect(200)
      .expect('Hello World!');
  });
});
