import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { DistrictRepository } from './district.repository';
import { District, DistrictSchema } from './schema/district.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: District.name,
        schema: DistrictSchema,
      },
    ]),
  ],

  controllers: [DistrictController],
  providers: [DistrictService,DistrictRepository],
  exports: [DistrictService,DistrictRepository],

})
export class DistrictModule {}