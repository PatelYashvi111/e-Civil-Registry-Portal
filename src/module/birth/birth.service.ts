import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateBirthDto } from "./dto/create-birth.dto";
import { UpdateBirthDto } from "./dto/update-birth.dto";
import { BirthRepository } from "./birth.repositroy";
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
export class BirthService {

    constructor(
        private readonly birthRepository: BirthRepository,
        private readonly aadharRepository: AadharRepository,
        private readonly cloudinaryService: CloudinaryService,
        private readonly counterService: CounterService,
        private readonly jwtService: JwtService,
        private readonly aadharService: AadharService,
    ){}

    async create( createBirthDto: CreateBirthDto , files: {
        fatherAadharCard?: Express.Multer.File[];
        motherAadharCard?: Express.Multer.File[];
        marriageCertificate?: Express.Multer.File[];
        birthHospitalReport?: Express.Multer.File[];
        rationCard?: Express.Multer.File[];
    }) {
        const parsed = dayjs(
        createBirthDto.birthDateAndTime,
        'DD-MMM-YYYY h:mm a',
        true,
        );

        if (!parsed.isValid()) {
        throw new BadRequestException('Invalid birth date and time.');
        }

        const birthDate = parsed.toDate();

        const existingBirth = await this.birthRepository.findDuplication(
        createBirthDto.babyName,
        birthDate,
        createBirthDto.fatherAadharId,
        createBirthDto.motherAadharId,
        );

       if(existingBirth) {
          throw new BadRequestException('Birth record is already exists.');
       }

       if( createBirthDto.babyWeight <= 0 ) {
          throw new BadRequestException('Baby weight must be greater than 0.')
       }

       if (!createBirthDto.fatherVerificationToken) {
         throw new BadRequestException('Verification token is required');
       }
              
      const fatherpayload = this.jwtService.verify(createBirthDto.fatherVerificationToken);

       if (fatherpayload.purpose !== 'registration') {
         throw new BadRequestException('Invalid token');
       }
       
      const fatherAadhar = await this.aadharService.findById(fatherpayload.fatherAadharId);

        if (!fatherAadhar) {
            throw new NotFoundException('Father Aadhar ID not found.');
        }

         if (!createBirthDto.motherVerificationToken) {
         throw new BadRequestException('Verification token is required');
       }

      const motherpayload = this.jwtService.verify(createBirthDto.motherVerificationToken);

       if (motherpayload.purpose !== 'registration') {
         throw new BadRequestException('Invalid token');
       }

       const motherAadhar = await this.aadharService.findById(motherpayload.motherAadharId);

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

        const applicationNumber = await this.counterService.generateBirthApplication();

        console.log('Generated Application Number:', applicationNumber);

        const finalData = {
            ...createBirthDto,
            birthDateAndTime: birthDate,
            applicationNumber,
            fatherAadharCard: fatherAadharCard.url,
            motherAadharCard: motherAadharCard.url,
            marriageCertificate: marriageCertificate.url,
            birthHospitalReport: birthHospitalReport.url,
            rationCard: rationCard.url,
};

        return await this.birthRepository.create( finalData as any);

    }

    async findAll(paginationDto: PaginationDto) {
        const { page=1 , limit=10 } = paginationDto;
        const skip = (page - 1) * limit;
        return await this.birthRepository.findAll(skip, limit, page);
    }

    async findById( id: string ) {
        return await this.birthRepository.findById( id );
    }

    async update(id: string, updateBirthDto: UpdateBirthDto) {
    const birth = await this.birthRepository.findById(id);

    if (!birth) {
        throw new NotFoundException('Birth record not found.');
    }

    const parsed = dayjs(
        updateBirthDto.birthDateAndTime as string,
        'DD-MMM-YYYY h:mm a',
        true,
    );

    if (!parsed.isValid()) {
        throw new BadRequestException('Invalid birth date and time.');
    }

    const birthDate = parsed.toDate();

    const existingBirth = await this.birthRepository.findDuplication(
        updateBirthDto.babyName as string,
        birthDate,
        updateBirthDto.fatherAadharId as string,
        updateBirthDto.motherAadharId as string,
    );

    if (existingBirth && existingBirth.id !== id) {
        throw new BadRequestException('Birth record already exists.');
    }

    const finalData = {
        ...updateBirthDto,
        birthDateAndTime: birthDate,
    };

    return await this.birthRepository.update(id, finalData as any);
    }
        async delete( id: string ) {
       const birth = await this.birthRepository.findById( id );

        if(!birth) {
            throw new NotFoundException('Birth record not found.');
        }

        return await this.birthRepository.delete( id );
    }
    
}