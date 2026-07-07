import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateMarriageDto } from "./dto/create-marriage.dto";
import { UpdateMarriageDto } from "./dto/update-marriage.dto";
import { MarriageRepository } from "./marriage.repository";
import { AadharRepository } from "../aadhar/aadhar.repository";
import { CloudinaryService } from "../../common/cloudinary/cloudinary.service";
<<<<<<< HEAD
import { CounterService } from "../counter/counter.service";
=======
import { PaginationDto } from "src/common/paginatio/dto/pagination.dto";
>>>>>>> feat/service

@Injectable()
export class MarriageService {

    constructor(
        private readonly marriageRepository: MarriageRepository,
        private readonly aadharRepository: AadharRepository,
        private readonly cloudinaryService: CloudinaryService,
        private readonly counterService: CounterService,
    ){}

    async create( createMarriageDto: CreateMarriageDto, files: {
        brideAadharCard?: Express.Multer.File[];
        groomAadharCard?: Express.Multer.File[];
        witnessAadharCard?: Express.Multer.File[];
        brahmanAadharCard?: Express.Multer.File[];
        brideRationCard?: Express.Multer.File[];
        groomRationCard?: Express.Multer.File[];
        bridePhoto?: Express.Multer.File[];
        groomPhoto?: Express.Multer.File[];
        invitationCard?: Express.Multer.File[];
    } ) {
       const existingMarriage = await this.marriageRepository.findDuplication(
            createMarriageDto.brideAadharId,
            createMarriageDto.groomAadharId,
            new Date(createMarriageDto.marriageDate),
        )

        if(existingMarriage) {
            throw new BadRequestException('Marriage records is already exists.');
        }

       const brideAadhar = await this.aadharRepository.findById(createMarriageDto.brideAadharId);

        if(!brideAadhar) {
            throw new NotFoundException('Bride Aadhar ID not found.');
        
        }

       const groomAadhar = await this.aadharRepository.findById(createMarriageDto.groomAadharId);

        if(!groomAadhar) {
            throw new NotFoundException('Groom Aadhar ID not found.');
        }

       const witnessAadhar = await this.aadharRepository.findById(createMarriageDto.witnessAadharId);

        if(!witnessAadhar) {
            throw new NotFoundException('Witness Aadhar ID not found.');
        }

       const brahmanAadhar = await this.aadharRepository.findById(createMarriageDto.brahmanAadharId);

        if(!brahmanAadhar) {
            throw new NotFoundException('Brahman Aadhar ID not found.');
        }

        if(createMarriageDto.witnessAadharId.toString() === createMarriageDto.brideAadharId.toString()) {
            throw new BadRequestException('Witness cannot be Bride');
        }

        if(createMarriageDto.witnessAadharId.toString() === createMarriageDto.groomAadharId.toString()) {
            throw new BadRequestException('Witness cannot be Groom');
        }
        
        const brideAadharCardFile = files.brideAadharCard?.[0];
        const groomAadharCardFile = files.groomAadharCard?.[0];
        const witnessAadharCardFile = files.witnessAadharCard?.[0];
        const brahmanAadharCardFile = files.brahmanAadharCard?.[0];
        const brideRationCardFile = files.brideRationCard?.[0];
        const groomRationCardFile = files.groomRationCard?.[0];
        const bridePhotoFile = files.bridePhoto?.[0];
        const groomPhotoFile = files.groomPhoto?.[0];
        const invitationCardFile = files.invitationCard?.[0];

        if(
            !brideAadharCardFile ||
            !groomAadharCardFile ||
            !witnessAadharCardFile ||
            !brahmanAadharCardFile ||
            !brideRationCardFile ||
            !groomRationCardFile ||
            !bridePhotoFile ||
            !groomPhotoFile ||
            !invitationCardFile
        ) {
            throw new BadRequestException('All required marriage documents must be uploaded.');
        }
        
         const brideAadharCard = await this.cloudinaryService.uploadFile(
            brideAadharCardFile,
            'marriage'
            );

         const groomAadharCard = await this.cloudinaryService.uploadFile(
            groomAadharCardFile,
            'marriage'
            );
        
         const witnessAadharCard = await this.cloudinaryService.uploadFile(
            witnessAadharCardFile,
            'marriage'
            );

         const brahmanAadharCard = await this.cloudinaryService.uploadFile(
            brahmanAadharCardFile,
            'marriage'
            );

         const brideRationCard = await this.cloudinaryService.uploadFile(
            brideRationCardFile,
            'marriage'
            );

         const groomRationCard = await this.cloudinaryService.uploadFile(
            groomRationCardFile,
            'marriage'
            );

         const bridePhoto = await this.cloudinaryService.uploadFile(
            bridePhotoFile,
            'marriage'
            );

         const groomPhoto = await this.cloudinaryService.uploadFile(
            groomPhotoFile,
            'marriage'
            );

         const invitationCard = await this.cloudinaryService.uploadFile(
            invitationCardFile,
            'marriage'
            );

        const applicationNumber = await this.counterService.generateMarriageApplication();

        const finalData = {
        ...createMarriageDto ,
        applicationNumber,
        brideAadharCard: brideAadharCard.url,
        groomAadharCard: groomAadharCard.url,
        witnessAadharCard: witnessAadharCard.url,
        brahmanAadharCard: brahmanAadharCard.url,
        brideRationCard: brideRationCard.url,
        groomRationCard: groomRationCard.url,
        bridePhoto: bridePhoto.url,
        groomPhoto: groomPhoto.url,
        invitationCard: invitationCard.url,
        };

        return await this.marriageRepository.create( finalData );
    }

    async findAll(paginationDto: PaginationDto) {
        const { page=1, limit=10} = paginationDto;
        const skip = (page-1) *limit;
        return await this.marriageRepository.findAll(skip,limit,page);
    }

    async findById( id: string ) {
        return await this.marriageRepository.findById( id );
    }

    async update( id: string, updateMarriageDto: UpdateMarriageDto ) {
       const existingMarriage = await this.marriageRepository.findDuplication(
            updateMarriageDto.brideAadharId as string,
            updateMarriageDto.groomAadharId as string,
            new Date(updateMarriageDto.marriageDate as string),
        )

        if(existingMarriage) {  
             throw new BadRequestException('Marriage records is already exists.');
        }
        
       const marriage = await this.marriageRepository.findById( id );

        if(!marriage) {
            throw new NotFoundException('Marriage record not found.');
        }

        return await this.marriageRepository.update( id, updateMarriageDto );
    }

    async delete( id: string ) {
       const marriage = await this.marriageRepository.findById( id );

        if(!marriage) {
            throw new NotFoundException('Marriage record not found.');
        }

        return await this.marriageRepository.delete( id );
    }
    
}