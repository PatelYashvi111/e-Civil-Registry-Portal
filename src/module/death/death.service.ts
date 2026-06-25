import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateDeathDto } from "./dto/create-death.dto";
import { UpdateDeathDto } from "./dto/update-death.dto";
import { DeathRepository } from "./death.repository";
import { AadharRepository } from "../aadhar/aadhar.repository";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";

@Injectable()
export class DeathService {

    constructor(
        private readonly deathRepository: DeathRepository,
        private readonly aadharRepository: AadharRepository,
        private readonly cloudinaryService: CloudinaryService,
    ){}

    async create( createDeathDto: CreateDeathDto , files: {
        deceasedAadharCard?: Express.Multer.File[];
        spouseAadharCard?: Express.Multer.File[];
        deceasedRationCard?: Express.Multer.File[];
        deceasedPhoto?: Express.Multer.File[];
        deceasedMedicalCertificate?: Express.Multer.File[];
        pmReport?: Express.Multer.File[];
        fir?: Express.Multer.File[];

    }) {
       const existingDeath = await this.deathRepository.findDuplication(
            createDeathDto.deceasedAadharId,
            new Date(createDeathDto.dateOfDeath),   
            createDeathDto.timeOfDeath,
        )

        if(existingDeath) {
            throw new NotFoundException('Death record is already exists.');
        }

       const deceasedAadhar = await this.aadharRepository.findById(createDeathDto.deceasedAadharId);
        
        if(!deceasedAadhar) {
            throw new NotFoundException('Deceased Aadhar ID not found.');
        }

       const spouseAadhar = await this.aadharRepository.findById(createDeathDto.spouseAadharId);

        if(!spouseAadhar) {
            throw new NotFoundException('Spouse Aadhar ID not found.');
        }

        const deceasedAadharCardFile = files.deceasedAadharCard?.[0];
        const spouseAadharCardFile = files.spouseAadharCard?.[0];
        const deceasedRationCardFile = files.deceasedRationCard?.[0];
        const deceasedPhotoFile = files.deceasedPhoto?.[0];
        const deceasedMedicalCertificateFile = files.deceasedMedicalCertificate?.[0];
        const pmReportFile = files.pmReport?.[0];
        const firFile = files.fir?.[0];

        if(
            !deceasedAadharCardFile ||
            !spouseAadharCardFile ||
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

       const spouseAadharCard = await this.cloudinaryService.uploadFile(
        spouseAadharCardFile,
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

        createDeathDto.deceasedAadharCard = deceasedAadharCard.url;
        createDeathDto.spouseAadharCard = spouseAadharCard.url;
        createDeathDto.deceasedRationCard = deceasedRationCard.url;
        createDeathDto.deceasedPhoto = deceasedPhoto.url;
        createDeathDto.deceasedMedicalCertificate = deceasedMedicalCertificate.url;
        createDeathDto.pmReport = pmReport.url;
        createDeathDto.fir = fir.url;

        return await this.deathRepository.create( createDeathDto );
    }

    async findAll() {
        return await this.deathRepository.findAll();
    }

    async findById( id: string ) {
        return await this.deathRepository.findById( id );
    }

    async update( id: string, updateDeathDto: UpdateDeathDto ) {
       const existingDeath = await this.deathRepository.findDuplication(
            updateDeathDto.deceasedAadharId as string,
            new Date(updateDeathDto.dateOfDeath as string),   
            updateDeathDto.timeOfDeath as string,
        )

        if(existingDeath) {
            throw new NotFoundException('Death record is already exists.');
        }
       
       const death = await this.deathRepository.findById( id );

        if(!death) {
            throw new NotFoundException('Death record not found');
        }
        
        return await this.deathRepository.update( id, updateDeathDto );
    }

    async delete( id: string ) {
       const death = await this.deathRepository.findById( id );
        
        if(!death) {
            throw new NotFoundException('Death record not found');
        }

        return await this.deathRepository.delete( id );
    }
    
}