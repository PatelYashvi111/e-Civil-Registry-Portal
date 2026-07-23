import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateMarriageDto } from "./dto/create-marriage.dto";
import { UpdateMarriageDto } from "./dto/update-marriage.dto";
import { MarriageRepository } from "./marriage.repository";
import { AadharRepository } from "../aadhar/aadhar.repository";
import { OfficeDepartmentService } from "../officeDepartment/officeDepartment.service";
import { SlotService } from "../slot/slot.service";
import { CloudinaryService } from "../../common/cloudinary/cloudinary.service";
import { CounterService } from "../counter/counter.service";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";
import { JwtService } from "@nestjs/jwt";
import { AadharService } from "../aadhar/aadhar.service";
import { ApplicationService } from "../application/application.service";
import { ServiceEnum } from "src/common/enums/service.enums";
import { JwtPayload } from "src/common/interface/jwt-payload.interface";    
import { Types } from "mongoose";

@Injectable()
export class MarriageService {

    constructor(
        private readonly marriageRepository: MarriageRepository,
        private readonly aadharRepository: AadharRepository,
        private readonly cloudinaryService: CloudinaryService,
        private readonly counterService: CounterService,
        private readonly officeDepartmentService: OfficeDepartmentService,
        private readonly slotService: SlotService,
        private readonly jwtService: JwtService,
        private readonly aadharService: AadharService,
        private readonly applicationService: ApplicationService,
    ){}

    async create( 
        createMarriageDto: CreateMarriageDto,user: JwtPayload,files: {
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

        const marriageDate = new Date(createMarriageDto.marriageDate);

if (isNaN(marriageDate.getTime())) {
    throw new BadRequestException('Invalid marriage date.');
}

         if (!createMarriageDto.brideVerificationToken) {
        throw new BadRequestException('Verification token is required');
        }

        const bridepayload = this.jwtService.verify(createMarriageDto.brideVerificationToken);

        if (bridepayload.purpose !== 'registration') {
        throw new BadRequestException('Invalid token');
        }

       let brideAadhar;

        if (Types.ObjectId.isValid(createMarriageDto.brideAadharId)) {
            brideAadhar = await this.aadharService.findById(
                createMarriageDto.brideAadharId,
            );
        } else {
            brideAadhar = await this.aadharService.findByAadharNumber(
                createMarriageDto.brideAadharId,
            );
        }

        if (!brideAadhar) {
            throw new NotFoundException('Bride Aadhar not found.');
        }

        if (!createMarriageDto.groomVerificationToken) {
        throw new BadRequestException('Verification token is required');
        }

        const groompayload = this.jwtService.verify(createMarriageDto.groomVerificationToken);

        if (groompayload.purpose !== 'registration') {
        throw new BadRequestException('Invalid token');
        }

       let groomAadhar;

        if (Types.ObjectId.isValid(createMarriageDto.groomAadharId)) {
            groomAadhar = await this.aadharService.findById(
                createMarriageDto.groomAadharId,
            );
        } else {
            groomAadhar = await this.aadharService.findByAadharNumber(
                createMarriageDto.groomAadharId,
            );
        }

        if (!groomAadhar) {
            throw new NotFoundException('Groom Aadhar not found.');
        }

        const existingMarriage = await this.marriageRepository.findDuplication(
        brideAadhar._id.toString(),
        groomAadhar._id.toString(),
        marriageDate,
    );

        if(existingMarriage) {
            throw new BadRequestException('Marriage records is already exists.');
        }


       if (!createMarriageDto.witnessVerificationToken) {
        throw new BadRequestException('Verification token is required');
        }

        const witnesspayload = this.jwtService.verify(createMarriageDto.witnessVerificationToken);

        if (witnesspayload.purpose !== 'registration') {
        throw new BadRequestException('Invalid token');
        }

        let witnessAadhar;

        if (Types.ObjectId.isValid(createMarriageDto.witnessAadharId)) {
            witnessAadhar = await this.aadharService.findById(
                createMarriageDto.witnessAadharId,
            );
        } else {
            witnessAadhar = await this.aadharService.findByAadharNumber(
                createMarriageDto.witnessAadharId,
            );
        }

        if (!witnessAadhar) {
            throw new NotFoundException('Witness Aadhar not found.');
        }

        if (!createMarriageDto.brahmanVerificationToken) {
        throw new BadRequestException('Verification token is required');
        }

        const brahmanpayload = this.jwtService.verify(createMarriageDto.brahmanVerificationToken);

        if (brahmanpayload.purpose !== 'registration') {
        throw new BadRequestException('Invalid token');
        }

        let brahmanAadhar;

    if (Types.ObjectId.isValid(createMarriageDto.brahmanAadharId)) {
        brahmanAadhar = await this.aadharService.findById(
            createMarriageDto.brahmanAadharId,
        );
    } else {
        brahmanAadhar = await this.aadharService.findByAadharNumber(
            createMarriageDto.brahmanAadharId,
        );
    }

    if (!brahmanAadhar) {
        throw new NotFoundException('Brahman Aadhar not found.');
    }

    let officeDepartment;

    if (Types.ObjectId.isValid(createMarriageDto.officeDepartmentId)) {
        officeDepartment = await this.officeDepartmentService.findById(
            createMarriageDto.officeDepartmentId,
        );
    } else {
        officeDepartment = await this.officeDepartmentService.findByName(
            createMarriageDto.officeDepartmentId,
        );
    }

    if (!officeDepartment) {
        throw new NotFoundException('Office Department not found.');
    }
        const slot = await this.slotService.findById(createMarriageDto.slotId);

        if (!slot) {
        throw new NotFoundException('Slot not found.');
        }

        if (!slot.isAvailable) {
        throw new BadRequestException('Selected slot is not available.');
        }

        if (slot.bookedCount >= slot.maxCapacity) {
        throw new BadRequestException('Selected slot is full.');
        }


        if(createMarriageDto.witnessAadharId.toString() === createMarriageDto.brideAadharId.toString()) {
            throw new BadRequestException('Witness cannot be Bride');
        }

        if(createMarriageDto.witnessAadharId.toString() === createMarriageDto.groomAadharId.toString()) {
            throw new BadRequestException('Witness cannot be Groom');
        }

        if(createMarriageDto.brahmanAadharId.toString() === createMarriageDto.brideAadharId.toString()) {
            throw new BadRequestException('brahman cannot be Bride');
        }

        if(createMarriageDto.brahmanAadharId.toString() === createMarriageDto.groomAadharId.toString()) {
            throw new BadRequestException('brahman cannot be Groom');
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
        marriageDate: marriageDate,
        applicationNumber,
        brideAadharId: brideAadhar._id.toString(),
        groomAadharId: groomAadhar._id.toString(),
        witnessAadharId: witnessAadhar._id.toString(),
        brahmanAadharId: brahmanAadhar._id.toString(),
        officeDepartmentId: officeDepartment._id.toString(),
        slotId: slot._id.toString(),
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
    
        const marriage = await this.marriageRepository.create( finalData as any );
        
            await this.applicationService.createApplicationFromService({
            userId: user.userId,
            officeDepartmentId: marriage.officeDepartmentId.toString(),
            slotId: marriage.slotId.toString(),
            serviceId: marriage._id.toString(),
            serviceType: ServiceEnum.MARRIAGE,
            applicationNumber,
        });
        
                return marriage;
                
        
    }

    async findAll(paginationDto: PaginationDto) {
        const { page=1, limit=10} = paginationDto;
        const skip = (page-1) *limit;
        return await this.marriageRepository.findAll(skip,limit,page);
    }

    async findById( id: string ) {
        return await this.marriageRepository.findById( id );
    }

    async update(id: string, updateMarriageDto: UpdateMarriageDto) {
    const marriage = await this.marriageRepository.findById(id);

    if (!marriage) {
        throw new NotFoundException('Marriage record not found.');
    }

    let brideAadhar;

    if (Types.ObjectId.isValid(updateMarriageDto.brideAadharId as string)) {
        brideAadhar = await this.aadharService.findById(
            updateMarriageDto.brideAadharId as string,
        );
    } else {
        brideAadhar = await this.aadharService.findByAadharNumber(
            updateMarriageDto.brideAadharId as string,
        );
    }

    if (!brideAadhar) {
        throw new NotFoundException('Bride Aadhar not found');
    }

    let groomAadhar;

    if (Types.ObjectId.isValid(updateMarriageDto.groomAadharId as string)) {
        groomAadhar = await this.aadharService.findById(
            updateMarriageDto.groomAadharId as string,
        );
    } else {
        groomAadhar = await this.aadharService.findByAadharNumber(
            updateMarriageDto.groomAadharId as string,
        );
    }

    if (!groomAadhar) {
        throw new NotFoundException('Groom Aadhar not found');
    }

    let witnessAadhar;

    if (Types.ObjectId.isValid(updateMarriageDto.witnessAadharId as string)) {
        witnessAadhar = await this.aadharService.findById(
            updateMarriageDto.witnessAadharId as string,
        );
    } else {
        witnessAadhar = await this.aadharService.findByAadharNumber(
            updateMarriageDto.witnessAadharId as string,
        );
    }

    if (!witnessAadhar) {
        throw new NotFoundException('Witness Aadhar not found');
    }

    let brahmanAadhar;

    if (Types.ObjectId.isValid(updateMarriageDto.brahmanAadharId as string)) {
        brahmanAadhar = await this.aadharService.findById(
            updateMarriageDto.brahmanAadharId as string,
        );
    } else {
        brahmanAadhar = await this.aadharService.findByAadharNumber(
            updateMarriageDto.brahmanAadharId as string,
        );
    }

    if (!brahmanAadhar) {
        throw new NotFoundException('Brahman Aadhar not found');
    }

    let officeDepartment;

    if (Types.ObjectId.isValid(updateMarriageDto.officeDepartmentId as string)) {
        officeDepartment = await this.officeDepartmentService.findById(
            updateMarriageDto.officeDepartmentId as string,
        );
    } else {
        officeDepartment = await this.officeDepartmentService.findByName(
            updateMarriageDto.officeDepartmentId as string,
        );
    }

    if (!officeDepartment) {
        throw new NotFoundException('Office Department not found');
    }

    if (!updateMarriageDto.slotId) {
        throw new BadRequestException('Slot ID is required.');
    }

    const slot = await this.slotService.findById(updateMarriageDto.slotId);

    if (!slot) {
        throw new NotFoundException('Slot not found.');
    }

    if (!slot.isAvailable) {
        throw new BadRequestException('Selected slot is not available.');
    }

    if (slot.bookedCount >= slot.maxCapacity) {
        throw new BadRequestException('Selected slot is full.');
    }


    const existingMarriage = await this.marriageRepository.findDuplication(
        brideAadhar._id.toString(),
        groomAadhar._id.toString(),
        new Date(updateMarriageDto.marriageDate as string),
    );

    if (existingMarriage && existingMarriage.id !== id) {
        throw new BadRequestException('Marriage record already exists.');
    }

    const finalData = {
        ...updateMarriageDto,
        brideAadharId: brideAadhar._id.toString(),
        groomAadharId: groomAadhar._id.toString(),
        witnessAadharId: witnessAadhar._id.toString(),
        brahmanAadharId: brahmanAadhar._id.toString(),
        officeDepartmentId: officeDepartment._id.toString(),
        slotId: slot._id.toString(),
    };

    return await this.marriageRepository.update(id, finalData as any);
}

    async delete( id: string ) {
       const marriage = await this.marriageRepository.findById( id );

        if(!marriage) {
            throw new NotFoundException('Marriage record not found.');
        }

        return await this.marriageRepository.delete( id );
    }
    
}