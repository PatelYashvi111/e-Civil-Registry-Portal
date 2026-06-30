import { Controller, Post, Get, Patch, Delete, Param, Body } from "@nestjs/common";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ApplicationService } from "./application.service";

@Controller('application')
export class ApplicationController {

    constructor(
        private readonly applicationService: ApplicationService,
    ) {}

    @Post('create')
    async createApplication( @Body() createApplicationDto: CreateApplicationDto ) {
        return await this.applicationService.createApplication( createApplicationDto );
    }

    @Get('all') 
    async findAll() {
        return await this.applicationService.findAll();
    }

    @Get(':applicationNumber')
    async findByApplicationNumber( @Param('applicationNumber') applicationNumber: string ) {
        return await this.applicationService.findByApplicationNumber( applicationNumber );
    }

    @Patch(':id')
    async updateApplication( @Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto ) {
        return await this.applicationService.updateApplication( id, updateApplicationDto );
    }

    @Delete(':id')
    async deleteApplication( @Param('id') id: string ) {
        return await this.applicationService.deleteApplication( id );
    }
}