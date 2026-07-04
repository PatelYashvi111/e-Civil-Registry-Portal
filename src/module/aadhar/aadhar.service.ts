import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { CreateAadharDto } from "./dto/create-aadhar.dto";
import { UpdateAadharDto } from "./dto/update-aadhar.dto";
import { AadharRepository } from "./aadhar.repository";
import { CloudinaryService } from "../../common/cloudinary/cloudinary.service";
import { PaginationDto } from "src/common/pagination/dto/pagination.dto";

@Injectable()
export class AadharService {

    constructor(
        private readonly aadharRepository: AadharRepository,
        private readonly cloudinaryService: CloudinaryService,
    ){}

<<<<<<< HEAD
    async createAadhar( data: CreateAadharDto ) {
=======
    async createAadhar( data: CreateAadharDto, file: Express.Multer.File ) {
>>>>>>> feat/user
        const existingAadhar = await this.aadharRepository.findByAadharNumber( data.aadharNumber );

        if( existingAadhar ) {
            throw new BadRequestException('Aadhar already exists');
        }

<<<<<<< HEAD
        return this.aadharRepository.createAadhar(data);
=======
        if(!file) {
            throw new BadRequestException('Photo is required');
        }

        const uploadedFile = await this.cloudinaryService.uploadFile(file,'aadhar');

        data.photo = uploadedFile.url;

        return this.aadharRepository.createAadhar( data );
>>>>>>> feat/user
    }

    async findAll(paginationDto: PaginationDto) {
        const { page = 1, limit = 10 } = paginationDto;

        const skip = (page - 1) * limit;

        return await this.aadharRepository.findAll(skip,limit,page);
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