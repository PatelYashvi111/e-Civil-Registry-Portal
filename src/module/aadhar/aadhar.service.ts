import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateAadharDto } from "./dto/create-aadhar.dto";
import { UpdateAadharDto } from "./dto/update-aadhar.dto";
import { AadharRepository } from "./aadhar.repository";

@Injectable()
export class AadharService {

    constructor(
        private readonly aadharRepository: AadharRepository,
    ){}

    async createAadhar( data: CreateAadharDto) {
        const existingAadhar = await this.aadharRepository.findByAadharNumber( data.aadharNumber );

        if( existingAadhar ) {
            throw new BadRequestException('Aadhar already exists');
        }

        return this.aadharRepository.createAadhar( data );
    }

    async findAll() {
        return await this.aadharRepository.findAll();
    }

    async findById( id: string ) {
        const aadhar = await this.aadharRepository.findById( id );

        if( !aadhar ) {
            throw new NotFoundException('Aadhar Record not found');
        }

        return aadhar;
    }

    async findByAadharNumber( aadharNumber: string ) {
        const aadhar = await this.aadharRepository.findByAadharNumber( aadharNumber );

        if(!aadhar) {
            throw new NotFoundException('Aadhar Record not Found')
        }
        
        return aadhar;

    }

    async updateAadhar( id: string, data: UpdateAadharDto ) { 
        const aadhar = await this.aadharRepository.findById( id );
        
        if(!aadhar){
            throw new NotFoundException('Aadhar Record not Found');
        }

          if (data.aadharNumber) {
        const existing = await this.aadharRepository.findByAadharNumber(data.aadharNumber);

        if (existing && existing.id !== id) {
            throw new BadRequestException('Aadhar number already exists');
        }
    }
    
        return await this.aadharRepository.updateAadhar( id, data );
    }

    async deleteAadhar( id: string ) {
        return await this.aadharRepository.deleteAadhar( id );
    }

}