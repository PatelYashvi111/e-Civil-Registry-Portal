import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateBirthDto } from "./dto/create-birth.dto";
import { UpdateBirthDto } from "./dto/update-birth.dto";
import { BirthRepository } from "./birth.repositroy";
import { AadharRepository } from "../aadhar/aadhar.repository";
import { CloudinaryService } from "src/common/cloudinary/cloudinary.service";
import { PaginationDto } from "src/common/paginatio/dto/pagination.dto";

@Injectable()
export class BirthService {

    constructor(
        private readonly birthRepository: BirthRepository,
        private readonly aadharRepository: AadharRepository,
        private readonly cloudinaryService: CloudinaryService,
    ){}

    async create( createBirthDto: CreateBirthDto , files: {
        fatherAadharCard?: Express.Multer.File[];
        motherAadharCard?: Express.Multer.File[];
        marriageCertificate?: Express.Multer.File[];
        birthHospitalReport?: Express.Multer.File[];
        rationCard?: Express.Multer.File[];
    }) {
      const existingBirth = await this.birthRepository.findDuplication(
            createBirthDto.babyName, 
            new Date(createBirthDto.birthDateAndTime),  
            createBirthDto.fatherAadharId, 
            createBirthDto.motherAadharId,
        )

       if(existingBirth) {
          throw new BadRequestException('Birth record is already exists.');
       }

       if( createBirthDto.babyWeight <= 0 ) {
          throw new BadRequestException('Baby weight must be greater than 0.')
       }
       
      const fatherAadhar = await this.aadharRepository.findById(createBirthDto.fatherAadharId);

        if (!fatherAadhar) {
            throw new NotFoundException('Father Aadhar ID not found.');
        }

       const motherAadhar = await this.aadharRepository.findById(createBirthDto.motherAadharId);

        if(!motherAadhar) {
            throw new NotFoundException('Mother Aadhar ID not found')
        }

        const fatherAadharCardFile = files.fatherAadharCard?.[0];
        const motherAadharCardFile = files.motherAadharCard?.[0];
        const marriageCertificateFile = files.marriageCertificate?.[0];
        const birthHospitalReportFile = files.birthHospitalReport?.[0];
        const rationCardFile = files.rationCard?.[0];

        if (
            !fatherAadharCardFile ||
            !motherAadharCardFile ||
            !marriageCertificateFile ||
            !birthHospitalReportFile ||
            !rationCardFile
        ) {
            throw new BadRequestException('All required birth documents must be uploaded.');
        }

        const fatherAadharCard = await this.cloudinaryService.uploadFile(
            fatherAadharCardFile,
            'birth',
        );

        const motherAadharCard = await this.cloudinaryService.uploadFile(
            motherAadharCardFile,
            'birth',
        );

        const marriageCertificate = await this.cloudinaryService.uploadFile(
            marriageCertificateFile,
            'birth',
        );

        const birthHospitalReport = await this.cloudinaryService.uploadFile(
            birthHospitalReportFile,
            'birth',
        );

        const rationCard = await this.cloudinaryService.uploadFile(
            rationCardFile,
            'birth',
        );

        const finalData = {
            ...createBirthDto,
            fatherAadharCard: fatherAadharCard.url,
            motherAadharCard: motherAadharCard.url,
            marriageCertificate: marriageCertificate.url,
            birthHospitalReport: birthHospitalReport.url,
            rationCard: rationCard.url,
};

        return await this.birthRepository.create( finalData );
    }

    async findAll(paginationDto: PaginationDto) {
        const { page=1 , limit=10 } = paginationDto;
        const skip = (page - 1) * limit;
        return await this.birthRepository.findAll(skip, limit, page);
    }

    async findById( id: string ) {
        return await this.birthRepository.findById( id );
    }

    async update( id: string, updateBirthDto: UpdateBirthDto ) {
       const existingBirth = await this.birthRepository.findDuplication(
            updateBirthDto.babyName as string, 
            new Date(updateBirthDto.birthDateAndTime as string),
            updateBirthDto.fatherAadharId as string, 
            updateBirthDto.motherAadharId as string,
        )

        if(existingBirth) {
            throw new BadRequestException('Birth record is already exists.');
        }
       
       const birth = await this.birthRepository.findById( id );

        if(!birth) {
            throw new NotFoundException('Birth record not found.');
        }

        return await this.birthRepository.update( id, updateBirthDto );
    }

    async delete( id: string ) {
       const birth = await this.birthRepository.findById( id );

        if(!birth) {
            throw new NotFoundException('Birth record not found.');
        }

        return await this.birthRepository.delete( id );
    }
    
}