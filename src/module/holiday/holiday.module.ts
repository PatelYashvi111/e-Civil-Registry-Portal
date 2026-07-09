import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HolidayRepository } from './holiday.repository';
import { HolidayService } from './holiday.service';
import { HolidayController } from './holiday.controller';
import { Holiday, HolidaySchema } from './schema/holiday.schema';

@Module({
    imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forFeature([
      {
        name: Holiday.name,
        schema: HolidaySchema,
      },
    ]),
    ],

  providers: [HolidayService, HolidayRepository],
  controllers: [HolidayController],
  exports: [ HolidayService, HolidayRepository]

})

export class HolidayModule {}