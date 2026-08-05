import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from "@nestjs/common";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { ApplicationRepository } from "./application.repository";
import { UserRepository } from "../user/user.repository";
import { OfficeDepartmentRepository } from "../officeDepartment/officeDepartment.repository";
import { SlotRepository } from "../slot/slot.repository";
import { ClerkService } from "../clerk/clerk.service";
import { CounterService } from "../counter/counter.service";
import { ServiceEnum } from "src/common/enums/service.enums";
import { JwtPayload } from "src/common/interface/jwt-payload.interface";
import { RoleEnum } from "src/common/enums/role.enums";
import { FilterDto } from "./dto/filter-application.dto";
import { EmailService } from "../email/email.service";
import { AadharRepository } from "../aadhar/aadhar.repository";
import { BirthService } from "../birth/birth.service";
import { Inject, forwardRef } from "@nestjs/common";
import { ApplicationStatusEnum } from "src/common/enums/application.status.enums";

@Injectable()
export class ApplicationService { 

    constructor(
        private readonly applicationRepository: ApplicationRepository,
        private readonly userRepository: UserRepository,
        private readonly officeDepartmentRepository: OfficeDepartmentRepository,
        private readonly slotRepository: SlotRepository,
        private readonly clerkService: ClerkService,
        private readonly counterService: CounterService,
        private readonly emailService: EmailService,
        private readonly aadharRepository: AadharRepository,

    ) {}

    async createApplicationFromService(data: {
      userId: string;
      officeDepartmentId: string;
      slotId: string;
      serviceId: string;
      serviceType: ServiceEnum;
      applicationNumber: string;
    }) {
        const user = await this.userRepository.findById(data.userId);

        if (!user) {
          throw new NotFoundException('User not found');
        }

        const officeDepartment = await this.officeDepartmentRepository.findById(data.officeDepartmentId);

        if (!officeDepartment) {
          throw new NotFoundException('Office Department not found');
        }

        const slot = await this.slotRepository.findById(data.slotId);

        if (!slot) {
          throw new NotFoundException('Slot Not Found');
        }

      const clerk = await this.clerkService.assignClerk(data.officeDepartmentId);

      const clerkId = clerk._id.toString();

      const application = await this.applicationRepository.createApplication({
        userId: data.userId,
        applicationNumber: data.applicationNumber,
        clerkId,
        officeDepartmentId: data.officeDepartmentId,
        slotId: data.slotId,
        serviceId: data.serviceId,
        serviceType: data.serviceType,
    });

    await this.clerkService.increaseWorkload(clerkId);

    return application;
    }

    async findAll(filterDto: FilterDto, user: JwtPayload) {
        const { page=1, limit=10, search, status } = filterDto;

        const skip = (page - 1) * limit;

        if(user.role === RoleEnum.USER) {
            return await this.applicationRepository.findByUserId(user.userId,skip,limit,status);
        }

        return await this.applicationRepository.findAll(skip,limit,page,search,status);  
    }
    
    async findByApplicationNumber( applicationNumber: string, user: JwtPayload ) {
        const application = await this.applicationRepository.findByApplicationNumber(applicationNumber);

        if(!application) {
            throw new NotFoundException('Application Not Found');
        }
        
        if(user.role === RoleEnum.USER && application.userId.toString() !== user.userId) {
            throw new ForbiddenException('Access Denied');
        }

        return application;
    }

    async findById(id: string, user: JwtPayload) {
    const application = await this.applicationRepository.findById(id);

    if (!application) {
      throw new NotFoundException("Application not found");
    }

    if (
      user.role === RoleEnum.USER &&
      application.userId.toString() !== user.userId
    ) {
      throw new ForbiddenException("Access Denied");
    }

    return application;
  }

  async findApplicationById(id: string) {
  const application = await this.applicationRepository.findById(id);

  if (!application) {
    throw new NotFoundException('Application not found');
  }

  return application;
}

   async updateApplication(id: string, updateApplicationDto: UpdateApplicationDto, user: JwtPayload) {

    const application = await this.applicationRepository.findById(id);

    if (!application) {
        throw new NotFoundException("Application Not found");
    }

    if (user.role === RoleEnum.USER && application.userId.toString() !== user.userId) {
        throw new ForbiddenException("Access Denied");
    }

    if (application.status !== ApplicationStatusEnum.PENDING) {
        throw new BadRequestException("Application has already been processed");
    }

    if (
        updateApplicationDto.status !== ApplicationStatusEnum.APPROVED &&
        updateApplicationDto.status !== ApplicationStatusEnum.REJECTED
    ) {
        throw new BadRequestException("Status must be APPROVED or REJECTED");
    }

    const updatedApplication = await this.applicationRepository.updateApplication(id, updateApplicationDto);

    if (!updatedApplication) {
        throw new NotFoundException("Application update failed");
    }

    return updatedApplication;
}

    async getMonthlyApplications(year: number, clerkId?: string) {
      const result = await this.applicationRepository.getMonthlyApplications(year,clerkId);

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      return months.map((month, index) => {
        const data = result.find(item => item._id === index + 1);

        return {
          month,
          count: data ? data.count : 0,
        };
      });
    }

  async deleteApplication( id: string ) {
        const application = await this.applicationRepository.findById( id );

        if(!application) {
            throw new NotFoundException('Application Not found');
        }

        return await this.applicationRepository.deleteApplication( id );
    }
}

