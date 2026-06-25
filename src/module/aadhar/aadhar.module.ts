import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AadharController } from './aadhar.controller';
import { AadharService } from './aadhar.service';
import { AadharRepository } from './aadhar.repository';
import { Aadhar, AadharSchema } from './schema/aadhar.schema';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({

 imports: [
    MongooseModule.forFeature([
      {
        name: Aadhar.name,
        schema: AadharSchema,
      },
    ]),
    CloudinaryModule,
  ],

  controllers: [AadharController],
  providers: [AadharService, AadharRepository],
  exports: [AadharService, AadharRepository,MongooseModule], 

})
export class AadharModule {}