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

    async create( createDeathDto: CreateDeathDto , filePath: string) {
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
        
        const uploadedFile = await this.cloudinaryService.uploadFile(filePath,'death');

        createDeathDto.deceasedPhoto = uploadedFile.url;

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