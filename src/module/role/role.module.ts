import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schema/role.schema';

@Module({

    imports: [
        MongooseModule.forFeature([
            { 
                name: Role.name, schema: RoleSchema
            },
        ]),
    ],

    controllers: [RoleController],
    providers: [RoleService, RoleRepository],
    exports: [RoleService, RoleRepository],

})

export class RoleModule {}