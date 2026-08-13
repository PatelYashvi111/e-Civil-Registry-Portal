import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateDeathDto } from "./dto/create-death.dto";
import { UpdateDeathDto } from "./dto/update-death.dto";
import { DeathRepository } from "./death.repository";
import { AadharRepository } from "../aadhar/aadhar.repository";
import { SlotService } from "../slot/slot.service";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";
import { CounterService } from "../counter/counter.service";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";
import { OfficeDepartmentService } from "../officeDepartment/officeDepartment.service";
import { Types } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/common/interface/jwt-payload.interface";
import { ApplicationService } from "../application/application.service";
import { AadharService } from "../aadhar/aadhar.service";
import { DeathEnum } from "../../common/enums/death.enums";
import { ServiceEnum } from "src/common/enums/service.enums";
import { CreateApplicationDto } from "../application/dto/create-application.dto";

@Injectable()
export class DeathService {

    constructor(
        private readonly deathRepository: DeathRepository,
        private readonly aadharRepository: AadharRepository,
        private readonly cloudinaryService: CloudinaryService,
        private readonly counterService: CounterService,
        private readonly officeDepartmentService: OfficeDepartmentService,
        private readonly applicationService: ApplicationService,
        private readonly jwtService: JwtService,
        private readonly aadharService: AadharService,
        private readonly slotService: SlotService,
    ){}

    async create( createDeathDto: CreateDeathDto ,user: JwtPayload,files: {
        deceasedAadharCard?: Express.Multer.File[];
        applicantAadharCard?: Express.Multer.File[];
        deceasedRationCard?: Express.Multer.File[];
        deceasedPhoto?: Express.Multer.File[];
        deceasedMedicalCertificate?: Express.Multer.File[];
        pmReport?: Express.Multer.File[];
        fir?: Express.Multer.File[];

    }) {
       
         createDeathDto.deathType =
    createDeathDto.deathType.trim().toLowerCase() as DeathEnum;
    
        const deathDate = new Date(createDeathDto.dateAndTimeOfDeath);

        if (isNaN(deathDate.getTime())) {
        throw new BadRequestException('Invalid death date and time.');
        }

        const existingDeath = await this.deathRepository.findDuplication(
            createDeathDto.deceasedAadharId,
            deathDate,   
        )

        if(existingDeath) {
            throw new NotFoundException('Death record is already exists.');
        }
        
        if (!createDeathDto.deceasedVerificationToken) {
            throw new BadRequestException('Verification token is required');
        }

        const deceasedpayload = this.jwtService.verify(createDeathDto.deceasedVerificationToken);
                
        if (deceasedpayload.purpose !== 'registration') {
            throw new BadRequestException('Invalid token');
        }

        let deceasedAadhar;

        if (Types.ObjectId.isValid(createDeathDto.deceasedAadharId)) {
            deceasedAadhar = await this.aadharService.findById(
                createDeathDto.deceasedAadharId,
            );
        } else {
            deceasedAadhar = await this.aadharService.findByAadharNumber(
                createDeathDto.deceasedAadharId,
            );
        }

        if (!deceasedAadhar) {
            throw new NotFoundException('Deceased Aadhar not found.');
        }
        
        if (!createDeathDto.applicantVerificationToken) {
            throw new BadRequestException('Verification token is required');
        }
                
         const applicantpayload = this.jwtService.verify(createDeathDto.applicantVerificationToken);

        if (applicantpayload.purpose !== 'registration') {
            throw new BadRequestException('Invalid token');
        }

        let applicantAadhar;

        if (Types.ObjectId.isValid(createDeathDto.applicantAadharId)) {
            applicantAadhar = await this.aadharService.findById(
                createDeathDto.applicantAadharId,
            );
        } else {
            applicantAadhar = await this.aadharService.findByAadharNumber(
                createDeathDto.applicantAadharId,
            );
        }

        if (!applicantAadhar) {
            throw new NotFoundException('Applicant Aadhar not found.');
        }

       let officeDepartment;

if (Types.ObjectId.isValid(createDeathDto.officeDepartmentId)) {
    officeDepartment = await this.officeDepartmentService.findById(
        createDeathDto.officeDepartmentId,
    );
} else {
    officeDepartment = await this.officeDepartmentService.findByName(
        createDeathDto.officeDepartmentId,
    );
}

if (!officeDepartment) {
    throw new NotFoundException('Office Department not found.');
}



if (!createDeathDto.slotId || createDeathDto.slotId === 'undefined') {
    throw new BadRequestException('Frontend Error: You forgot to send the slotId in the FormData.');
}

if (!Types.ObjectId.isValid(createDeathDto.slotId)) {
    throw new BadRequestException('Frontend Error: The slotId provided is not a valid MongoDB ObjectId.');
}
        const slot = await this.slotService.findById(createDeathDto.slotId);

        if (!slot) {
        throw new NotFoundException('Slot not found.');
        }

        if (!slot.isAvailable) {
        throw new BadRequestException('Selected slot is not available.');
        }

        if (slot.bookedCount >= slot.maxCapacity) {
        throw new BadRequestException('Selected slot is full.');
        }
        

        const deceasedAadharCardFile = files.deceasedAadharCard?.[0];
        const applicantAadharCardFile = files.applicantAadharCard?.[0];
        const deceasedRationCardFile = files.deceasedRationCard?.[0];
        const deceasedPhotoFile = files.deceasedPhoto?.[0];
        const deceasedMedicalCertificateFile = files.deceasedMedicalCertificate?.[0];
        const pmReportFile = files.pmReport?.[0];
        const firFile = files.fir?.[0];

        if(
            !deceasedAadharCardFile ||
            !applicantAadharCardFile ||
            !deceasedRationCardFile ||
            !deceasedPhotoFile ||
            !deceasedMedicalCertificateFile ||
            !pmReportFile ||
            !firFile
        ) {
            throw new NotFoundException('All required death documents must be uploaded.');
        }
        
       const deceasedAadharCard = await this.cloudinaryService.uploadFile(
        deceasedAadharCardFile,
        'Death'
        );

       const applicantAadharCard = await this.cloudinaryService.uploadFile(
        applicantAadharCardFile,
        'Death'
        );

       const deceasedRationCard = await this.cloudinaryService.uploadFile(
        deceasedRationCardFile,
        'Death'
        );

       const deceasedPhoto = await this.cloudinaryService.uploadFile(
        deceasedPhotoFile,
        'Death'
        );

       const deceasedMedicalCertificate = await this.cloudinaryService.uploadFile(
        deceasedMedicalCertificateFile,
        'Death'
        );

       const pmReport = await this.cloudinaryService.uploadFile(
        pmReportFile,
        'Death'
        );

       const fir = await this.cloudinaryService.uploadFile(
        firFile,
        'Death'
        );

        const applicationNumber = await this.counterService.generateDeathApplication();

        const finalData = {
        ...createDeathDto,
        applicationNumber,
        dateAndTimeOfDeath: deathDate,
        deceasedAadharId: deceasedAadhar._id.toString(),
        applicantAadharId: applicantAadhar._id.toString(),
        officeDepartmentId: officeDepartment._id.toString(),
        slotId: slot._id.toString(),
        deceasedAadharCard: deceasedAadharCard.url,
        applicantAadharCard: applicantAadharCard.url,
        deceasedRationCard: deceasedRationCard.url,
        deceasedPhoto: deceasedPhoto.url,
        deceasedMedicalCertificate: deceasedMedicalCertificate.url,
        pmReport: pmReport.url,
        fir: fir.url,
        }

         const death = await this.deathRepository.create( finalData as any );
        
            await this.applicationService.createApplication({
            userId: user.userId,
            officeDepartmentId: death.officeDepartmentId.toString(),
            slotId: death.slotId.toString(),
            serviceId: death._id.toString(),
            serviceType: ServiceEnum.DEATH,
            applicationNumber,
        }as CreateApplicationDto, user);
        
               return death;
        
    }

    async findAll(paginationDto: PaginationDto) {
        return await this.deathRepository.findAll(paginationDto);
    }

    async findById( id: string ) {
        return await this.deathRepository.findById( id );
    }

   async update(id: string, updateDeathDto: UpdateDeathDto) {
    const death = await this.deathRepository.findById(id);

    if (!death) {
        throw new NotFoundException('Death record not found.');
    }

   let deathDate = death.dateAndTimeOfDeath;

if (updateDeathDto.dateAndTimeOfDeath) {
    deathDate = new Date(updateDeathDto.dateAndTimeOfDeath);

    if (isNaN(deathDate.getTime())) {
        throw new BadRequestException('Invalid death date and time.');
    }
}

    let deceasedAadhar;

    console.log("Deceased Aadhar:", updateDeathDto.deceasedAadharId);

    if(updateDeathDto.deceasedAadharId){
    if (Types.ObjectId.isValid(updateDeathDto.deceasedAadharId)) {
        deceasedAadhar = await this.aadharService.findById(
            updateDeathDto.deceasedAadharId,
        );
    } else {
        deceasedAadhar = await this.aadharService.findByAadharNumber(
            updateDeathDto.deceasedAadharId,
        );
    }
       if (!deceasedAadhar) {
            throw new NotFoundException('decease Aadhar not found');
        }
    }
   
    else{
        deceasedAadhar = death.deceasedAadharId;
    }

    console.log("Deceased Found:", deceasedAadhar);
    if (!deceasedAadhar) {
        throw new NotFoundException('Deceased Aadhar not found');
    }

    let applicantAadhar;

    console.log("Applicant Aadhar:", updateDeathDto.applicantAadharId);

    if (updateDeathDto.applicantAadharId) {
    if (Types.ObjectId.isValid(updateDeathDto.applicantAadharId)) {
        applicantAadhar = await this.aadharService.findById(
            updateDeathDto.applicantAadharId,
        );
    } else {
        applicantAadhar = await this.aadharService.findByAadharNumber(
            updateDeathDto.applicantAadharId,
        );
    }

 if (!applicantAadhar) {
            throw new NotFoundException('applicant Aadhar not found');
        }
    }    
else{
     applicantAadhar = death.applicantAadharId;
}

    console.log("Applicant Found:", applicantAadhar);
    if (!applicantAadhar) {
        throw new NotFoundException('Applicant Aadhar not found');
    }

    let officeDepartment;

    if(updateDeathDto.officeDepartmentId) {
    if (Types.ObjectId.isValid(updateDeathDto.officeDepartmentId)) {
        officeDepartment = await this.officeDepartmentService.findById(
            updateDeathDto.officeDepartmentId,
        );
    } else {
        officeDepartment = await this.officeDepartmentService.findByName(
            updateDeathDto.officeDepartmentId,
        );
    }
    
}

    else{
        officeDepartment = death.officeDepartmentId;
    }

    if (!officeDepartment) {
            throw new NotFoundException('officeDepartment not found');
        }

    const existingDeath = await this.deathRepository.findDuplication(
        deceasedAadhar._id.toString(),
        deathDate,
    );

    if (existingDeath && existingDeath.id !== id) {
        throw new BadRequestException('Death record already exists.');
    }

    const finalData = {
            ...death.toObject(),
        ...updateDeathDto,
        dateAndTimeOfDeath: deathDate,
        deceasedAadharId: deceasedAadhar._id.toString(),
        applicantAadharId: applicantAadhar._id.toString(),
        officeDepartmentId: officeDepartment._id.toString(),
    };

    return await this.deathRepository.update(id, finalData as any);
}
    async delete( id: string ) {
       const death = await this.deathRepository.findById( id );
        
        if(!death) {
            throw new NotFoundException('Death record not found');
        }

        return await this.deathRepository.delete( id );
    }
    
}