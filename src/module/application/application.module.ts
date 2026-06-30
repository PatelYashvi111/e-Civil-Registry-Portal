import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ApplicationRepository } from "../application/application.repository";
import { ApplicationService } from "../application/application.service";
import { ApplicationController } from "../application/application.controller";
import { Application, ApplicationSchema } from "./schema/application.schema";

@Module({
    imports: [
       MongooseModule.forFeature([
        {
          name: Application.name,
          schema: ApplicationSchema,
        },
        ]),
    ],

    controllers: [ApplicationController],
    providers: [ApplicationService,ApplicationRepository],
    exports: [ApplicationService,ApplicationRepository    
    ]
})

export class ApplicationModule {}