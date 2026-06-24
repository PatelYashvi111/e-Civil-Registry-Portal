import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateMarriageDto } from "./dto/create-marriage.dto";
import { UpdateMarriageDto } from "./dto/update-marriage.dto";
import { MarriageRepository } from "./marriage.repository";
import { AadharRepository } from "../aadhar/aadhar.repository";

@Injectable()
export class MarriageService {

    constructor(
        private readonly marriageRepository: MarriageRepository,
        private readonly aadharRepository: AadharRepository,
    ){}

    async create( createMarriageDto: CreateMarriageDto ) {
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
        
        return await this.marriageRepository.create( createMarriageDto );
    }

    async findAll() {
        return await this.marriageRepository.findAll();
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