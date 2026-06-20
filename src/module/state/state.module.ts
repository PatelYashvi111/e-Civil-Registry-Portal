import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StateController } from './state.controller';
import { StateService } from './state.service';
import { StateRepository } from './state.repository';
import { State, StateSchema } from './schema/state.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: State.name,
        schema: StateSchema,
      },
    ]),
  ],

  controllers: [StateController],
  providers: [StateService,StateRepository],
  exports: [StateService,StateRepository],

})

export class StateModule {}