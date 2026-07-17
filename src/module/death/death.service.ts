import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CreateDeathDto } from "./dto/create-death.dto";
import { UpdateDeathDto } from "./dto/update-death.dto";
import { DeathRepository } from "./death.repository";
import { AadharRepository } from "../aadhar/aadhar.repository";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";
import { CounterService } from "../counter/counter.service";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { JwtService } from "@nestjs/jwt";
import { AadharService } from "../aadhar/aadhar.service";

@Injectable()
export class DeathService {

    constructor(
        private readonly deathRepository: DeathRepository,
        private readonly aadharRepository: AadharRepository,
        private readonly cloudinaryService: CloudinaryService,
        private readonly counterService: CounterService,
        private readonly jwtService: JwtService,
        private readonly aadharService: AadharService,
    ){}

    async create( createDeathDto: CreateDeathDto , files: {
        deceasedAadharCard?: Express.Multer.File[];
        applicantAadharCard?: Express.Multer.File[];
        deceasedRationCard?: Express.Multer.File[];
        deceasedPhoto?: Express.Multer.File[];
        deceasedMedicalCertificate?: Express.Multer.File[];
        pmReport?: Express.Multer.File[];
        fir?: Express.Multer.File[];

    }) {
         
        const parsed = dayjs(
        createDeathDto.dateAndTimeOfDeath,
        'DD-MMM-YYYY h:mm a',
        true,
        );

        if (!parsed.isValid()) {
        throw new BadRequestException('Invalid birth date and time.');
        }

        const deathDate = parsed.toDate();
        
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

       const deceasedAadhar = await this.aadharService.findById(deceasedpayload.deceasedAadharId);
        
        if(!deceasedAadhar) {
            throw new NotFoundException('Deceased Aadhar ID not found.');
        }
        
        if (!createDeathDto.applicantVerificationToken) {
            throw new BadRequestException('Verification token is required');
        }
                
         const applicantpayload = this.jwtService.verify(createDeathDto.applicantVerificationToken);

        if (applicantpayload.purpose !== 'registration') {
            throw new BadRequestException('Invalid token');
        }

       const applicantAadhar = await this.aadharRepository.findById(applicantpayload.applicantAadharId);

        if(!applicantAadhar) {
            throw new NotFoundException('Spouse Aadhar ID not found.');
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
        deceasedAadharCard: deceasedAadharCard.url,
        applicantAadharCard: applicantAadharCard.url,
        deceasedRationCard: deceasedRationCard.url,
        deceasedPhoto: deceasedPhoto.url,
        deceasedMedicalCertificate: deceasedMedicalCertificate.url,
        pmReport: pmReport.url,
        fir: fir.url,
        }

        return await this.deathRepository.create( finalData as any );

    }

    async findAll(paginationDto: PaginationDto) {
        const { page=1 , limit=10 } = paginationDto;
        const skip = (page - 1) * limit;
        return await this.deathRepository.findAll(skip, limit, page);
    }

    async findById( id: string ) {
        return await this.deathRepository.findById( id );
    }

        async update(id: string, updateDeathDto: UpdateDeathDto) {
    const death = await this.deathRepository.findById(id);

    if (!death) {
        throw new NotFoundException('Death record not found.');
    }

    const parsed = dayjs(
        updateDeathDto.dateAndTimeOfDeath as string,
        'DD-MMM-YYYY h:mm a',
        true,
    );

    if (!parsed.isValid()) {
        throw new BadRequestException('Invalid death date and time.');
    }

    const deathDate = parsed.toDate();

    const existingDeath = await this.deathRepository.findDuplication(
        updateDeathDto.deceasedAadharId as string,
        deathDate,
    );

    // Ignore the current record
    if (existingDeath && existingDeath.id !== id) {
        throw new BadRequestException('Death record already exists.');
    }

    const finalData = {
        ...updateDeathDto,
        dateAndTimeOfDeath: deathDate,
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