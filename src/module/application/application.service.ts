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
import { FilterApplicationDto } from "./dto/filter-application.dto";
import { EmailService } from "../email/email.service";
import { AadharRepository } from "../aadhar/aadhar.repository";
import { BirthService } from "../birth/birth.service";
import { Inject, forwardRef } from "@nestjs/common";
import { ApplicationStatusEnum } from "src/common/enums/application.status.enums";
import { CreateMeetingDto } from "../meeting/dto/create-meeting.dto";
import { MeetingService } from "../meeting/meeting.service";
import { MeetingStatusEnum } from "src/common/enums/meeting.status.enums";

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
        private readonly meetingService: MeetingService,

    ) {}

//     async createApplicationFromService(data: {
//       userId: string;
//       officeDepartmentId: string;
//       slotId: string;
//       serviceId: string;
//       serviceType: ServiceEnum;
//       applicationNumber: string;
//     }) {
//         const user = await this.userRepository.findById(data.userId);

//         if (!user) {
//           throw new NotFoundException('User not found');
//         }

//         const officeDepartment = await this.officeDepartmentRepository.findById(data.officeDepartmentId);

//         if (!officeDepartment) {
//           throw new NotFoundException('Office Department not found');
//         }

//         const slot = await this.slotRepository.findById(data.slotId);

//         if (!slot) {
//           throw new NotFoundException('Slot Not Found');
//         }

//       const clerk = await this.clerkService.assignClerk(data.officeDepartmentId);

//       const clerkId = clerk._id.toString();

//       const application = await this.applicationRepository.createApplication({
//         userId: data.userId,
//         applicationNumber: data.applicationNumber,
//         clerkId,
//         officeDepartmentId: data.officeDepartmentId,
//         slotId: data.slotId,
//         serviceId: data.serviceId,
//         serviceType: data.serviceType,
//     });

//     await this.meetingService.create({
//   applicationId: application._id.toString(),
// } as CreateMeetingDto);

//     await this.clerkService.increaseWorkload(clerkId);

//     return application;
//     }

 async createApplication( createApplicationDto: CreateApplicationDto, user: JwtPayload ) {
        const users = await this.userRepository.findById( createApplicationDto.userId );

        if(!users) {
            throw new NotFoundException('User not found');
        }
        
        // const aadhar = await this.aadharRepository.findById(users.aadharId.toString());

        // if(!aadhar) {
        //     throw new NotFoundException('Aadhar not found');
        // }

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

        const clerk = await this.clerkService.assignClerk(
  createApplicationDto.officeDepartmentId,
);

if (!clerk) {
  throw new NotFoundException("No clerk available");
}

const clerkId = clerk._id.toString();
        
        // let applicationNumber: string;

        // if(createApplicationDto.serviceType === ServiceEnum.BIRTH) {
        //     applicationNumber = await this.counterService.generateBirthApplication();
        // }
        // else if(createApplicationDto.serviceType === ServiceEnum.MARRIAGE) {
        //     applicationNumber = await this.counterService.generateMarriageApplication();
        // }
        // else if(createApplicationDto.serviceType === ServiceEnum.DEATH) {
        //     applicationNumber = await this.counterService.generateDeathApplication();
        // }
        // else {
        //     throw new BadRequestException('Invalid Service Type');
        // }


        const application = {
          ...createApplicationDto,
          userId: createApplicationDto.userId,
          clerkId,
        applicationNumber: createApplicationDto.applicationNumber,
        officeDepartmentId: createApplicationDto.officeDepartmentId,
        slotId: createApplicationDto.slotId,
        serviceId: createApplicationDto.serviceId,
        serviceType: createApplicationDto.serviceType,
        };
        
        const createdApplication =
         await this.applicationRepository.createApplication( application );

        //  await this.emailService.sendApplicationCreatedEmail(
        //     users.email,
        //     aadhar.firstName,
        //     createdApplication.applicationNumber,
        //     createdApplication.serviceType,
        //  )

         
    await this.meetingService.create({
  applicationId: createdApplication._id.toString(),
} as CreateMeetingDto);

    await this.clerkService.increaseWorkload(clerkId);

        return createdApplication;

    }  

    async findAll(filterApplicationDto: FilterApplicationDto, user: JwtPayload) {
        const { page=1, limit=10, search, status } = filterApplicationDto;

        const skip = (page - 1) * limit;

        if(user.role === RoleEnum.USER) {
            return await this.applicationRepository.findByUserId(user.userId,skip,limit,status);
        }

        return await this.applicationRepository.findAll(filterApplicationDto);  
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

    const meeting = await this.meetingService.findByApplicationId(id);

    if (!meeting) {
        throw new NotFoundException("Meeting not found");
    }

    if (meeting.status !== MeetingStatusEnum.COMPLETED) {
        throw new BadRequestException(
            "Application can only be approved or rejected after meeting completion",
        );
    }

    const updatedApplication = await this.applicationRepository.updateApplication(id, updateApplicationDto);

    if (!updatedApplication) {
        throw new NotFoundException("Application update failed");
    }

    if(updateApplicationDto.status === ApplicationStatusEnum.APPROVED) {
       
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

