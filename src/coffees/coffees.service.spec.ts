import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Event } from '../events/entities/event.entity';
import { getModelToken } from '@nestjs/mongoose';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/mongoTestUtil';
import { NotFoundException } from '@nestjs/common';
import { Document, Model } from 'mongoose';

const mockCoffeeModel = {
  findOne: jest.fn(),
  create: jest.fn(),
  exec: jest.fn(),
};

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        {
          provide: getModelToken(Coffee.name),
          useValue: mockCoffeeModel,
        },
        { provide: getModelToken(Event.name), useValue: {} },
      ],
      imports: [rootMongooseTestModule()],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeModel = module.get(getModelToken(Coffee.name));
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const coffeeId = '1';
        const expectedCoffee = {};

        coffeeModel.findOne.mockReturnValue(expectedCoffee);
        coffeeModel.exec.mockReturnValue(expectedCoffee);
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
      });
    });
    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async (done) => {
        const coffeeId = '1';
        coffeeModel.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(coffeeId);
          done();
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual(`Coffee #${coffeeId} not found`);
        }
      });
    });
  });
});
