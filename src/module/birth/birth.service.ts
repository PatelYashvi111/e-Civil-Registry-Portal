import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateBirthDto } from "./dto/create-birth.dto";
import { UpdateBirthDto } from "./dto/update-birth.dto";
import { BirthRepository } from "./birth.repositroy";
import { AadharRepository } from "../aadhar/aadhar.repository";

@Injectable()
export class BirthService {

    constructor(
        private readonly birthRepository: BirthRepository,
        private readonly aadharRepository: AadharRepository,
    ){}

    async create( createBirthDto: CreateBirthDto) {
      const existingBirth = await this.birthRepository.findDuplication(
            createBirthDto.babyName, 
           new Date(createBirthDto.birthDate),  
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
        
        return await this.birthRepository.create(createBirthDto);
    }

    async findAll() {
        return await this.birthRepository.findAll();
    }

    async findById( id: string ) {
        return await this.birthRepository.findById( id );
    }

    async update( id: string, updateBirthDto: UpdateBirthDto ) {
       const existingBirth = await this.birthRepository.findDuplication(
            updateBirthDto.babyName as string, 
            new Date(updateBirthDto.birthDate as string),
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