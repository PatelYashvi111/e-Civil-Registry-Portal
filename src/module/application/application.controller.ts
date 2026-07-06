import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Req, Query } from "@nestjs/common";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ApplicationService } from "./application.service";
import { RoleEnum } from "src/common/enums/role.enums";
import { RolesGuard } from "src/common/guards/role.guards";
import { Roles } from "src/common/decorators/role.decorators";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guards";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";

@Controller('application')
export class ApplicationController {

    constructor(
        private readonly applicationService: ApplicationService,
    ) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER, RoleEnum.CLERK, RoleEnum.ADMIN)
    @Post('create')
    async createApplication( @Body() createApplicationDto: CreateApplicationDto, @Req() req ) {
        return await this.applicationService.createApplication( createApplicationDto, req.user );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.CLERK, RoleEnum.ADMIN)
    @Get('all') 
    async findAll(@Query() paginationDto: PaginationDto, @Req() req) {
        return await this.applicationService.findAll(paginationDto, req.user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER, RoleEnum.CLERK, RoleEnum.ADMIN)
    @Get(':applicationNumber')
    async findByApplicationNumber( @Param('applicationNumber') applicationNumber: string, @Req() req ) {
        return await this.applicationService.findByApplicationNumber(applicationNumber, req.user );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.USER, RoleEnum.CLERK, RoleEnum.ADMIN)
    @Patch(':id')
    async updateApplication( @Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto, @Req() req ) {
        return await this.applicationService.updateApplication( id, updateApplicationDto, req.user );
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Delete(':id')
    async deleteApplication( @Param('id') id: string ) {
        return await this.applicationService.deleteApplication( id );
    }
}