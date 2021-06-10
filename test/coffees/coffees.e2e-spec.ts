import {
  HttpServer,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../mongoTestUtil';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwreck Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };
  const expectedPartialCoffee = jasmine.objectContaining({
    ...coffee,
    recommendations: 0,
    __v: 0,
    _id: jasmine.anything(),
  });

  let app: INestApplication;
  let httpServer: HttpServer;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoffeesModule, rootMongooseTestModule()],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
    httpServer = app.getHttpServer();
  });
  afterAll(async () => {
    await closeInMongodConnection();
    await app.close();
  });

  it('Create [POST /]', () => {
    return request(httpServer)
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);
    // .then(({ body }) => {
    //   expect(body).toContain(expectedPartialCoffee);
    // });
  });
  it('Get all [GET /]', async () => {
    const { body } = await request(httpServer)
      .get('/coffees')
      .expect(HttpStatus.OK);
    console.log(body);
    expect(body.length).toBeGreaterThan(0);
  });
  it('Get one [GET /:id]', async () => {
    const { body } = await request(httpServer).get('/coffees');
    console.log(body[0]._id);
    const mongodTestId = body[0]._id;
    const data = await request(httpServer)
      .get(`/coffees/${mongodTestId}`)
      .expect(HttpStatus.OK);
    expect(data.body.length).toBe(1);
  });
  it.todo('Update one [PATCH /:id]');
  it.todo('Delete one [DELETE /:id]');
});
