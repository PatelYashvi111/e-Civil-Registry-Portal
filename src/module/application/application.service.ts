import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ApplicationRepository } from "./application.repository";
import { UserRepository } from "../user/user.repository";
import { OfficeDepartmentRepository } from "../officeDepartment/officeDepartment.repository";
import { SlotRepository } from "../slot/slot.repository";
import { CounterService } from "../counter/counter.service";
import { ServiceEnum } from "src/common/enums/service.enums";

@Injectable()
export class ApplicationService {

    constructor(
        private readonly applicationRepository: ApplicationRepository,
        private readonly userRepository: UserRepository,
        private readonly officeDepartmentRepository: OfficeDepartmentRepository,
        private readonly slotRepository: SlotRepository,
        private readonly counterService: CounterService,
    ) {}

    async createApplication( createApplicationDto: CreateApplicationDto ) {
        const user = await this.userRepository.findById( createApplicationDto.userId );

        if(!user) {
            throw new NotFoundException('User not found');
        }

        const clerk = await this.userRepository.findById( createApplicationDto.clerkId );

        if(!clerk) {
            throw new NotFoundException('Clerk Not Found');
        }

        const officeDepartment = await this.officeDepartmentRepository.findById( createApplicationDto.officeDepartmentId);

        if(!officeDepartment) {
            throw new NotFoundException('Office Department Not Found');
        }

        const slot = await this.slotRepository.findById( createApplicationDto.slotId );

        if(!slot) {
            throw new NotFoundException('slot Not Found');
        }

        if(!slot.isAvailable) {
            throw new BadRequestException('Slot is not available');
        }

        if(slot.bookedCount >= slot.maxCapacity) {
            throw new BadRequestException('Slot is full');
        }

        if(slot.officeDepartmentId.toString() !== officeDepartment._id.toString()) {
            throw new BadRequestException('Slot does not belong to this office department');
        }

        let applicationNumber: string;

        if(createApplicationDto.serviceType === ServiceEnum.BIRTH) {
            applicationNumber = await this.counterService.generateBirthApplication();
        }
        else if(createApplicationDto.serviceType === ServiceEnum.MARRIAGE) {
            applicationNumber = await this.counterService.generateMarriageApplication();
        }
        else if(createApplicationDto.serviceType === ServiceEnum.DEATH) {
            applicationNumber = await this.counterService.generateDeathApplication();
        }
        else {
            throw new BadRequestException('Invalid Service Type');
        }

        const existingApplicationNumber = await this.applicationRepository.findByApplicationNumber(applicationNumber);

        if(existingApplicationNumber) {
            throw new BadRequestException('Application Number Already Exists');
        }

        const application = {...createApplicationDto, applicationNumber};
        
        const createdApplication = await this.applicationRepository.createApplication( application );

        return createdApplication;

    }                                                                                       

    async findAll() {
        return await this.applicationRepository.findAll();  
    }
    
    async findByApplicationNumber( applicationNumber: string ) {
        const application = await this.applicationRepository.findByApplicationNumber(applicationNumber);

        if(!application) {
            throw new NotFoundException('Application Not found');
        }
        
        return await this.applicationRepository.findByApplicationNumber(applicationNumber);
    }

    async updateApplication( id: string, updateApplicationDto: UpdateApplicationDto ) {
        const application = await this.applicationRepository.findById( id );

        if(!application) {
            throw new NotFoundException('Application Not found');
        }
        
         return await this.applicationRepository.updateApplication( id, updateApplicationDto );

    }

    async deleteApplication( id: string ) {
        const application = await this.applicationRepository.findById( id );

        if(!application) {
            throw new NotFoundException('Application Not found');
        }

        return await this.applicationRepository.deleteApplication( id );
    }
}