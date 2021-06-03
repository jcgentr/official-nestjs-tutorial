import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import coffeesConfig from './config/coffees.config';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';

class ConfigService {}
class DevConfigService {}
class ProdConfigService {}

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coffee.name, schema: CoffeeSchema },
      { name: Event.name, schema: EventSchema },
    ]),
    ConfigModule.forFeature(coffeesConfig),
  ],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    { provide: COFFEE_BRANDS, useFactory: () => ['buddy brew', 'nescafe'] },
    // {
    //   provide: ConfigService,
    //   useValue:
    //     process.env.NODE_ENV === 'development'
    //       ? DevConfigService
    //       : ProdConfigService,
    // },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
