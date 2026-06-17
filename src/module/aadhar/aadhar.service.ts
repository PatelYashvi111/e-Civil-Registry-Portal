import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { AadharRepository } from "./aadhar.repository";

@Injectable()
export class AadharService {

    constructor(
        private readonly aadharRepository: AadharRepository,
    ){}

    async createAadhar( data: any ) {
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

    async updateAadhar( id: string, data: any ) {    
        return await this.aadharRepository.updateAadhar( id, data );
    }

    async deleteAadhar( id: string ) {
        return await this.aadharRepository.deleteAadhar( id );
    }

}