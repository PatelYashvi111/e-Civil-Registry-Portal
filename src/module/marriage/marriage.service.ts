import { Injectable } from "@nestjs/common";
import { CreateMarriageDto } from "./dto/create-marriage.dto";
import { UpdateMarriageDto } from "./dto/update-marriage.dto";
import { MarriageRepository } from "./marriage.repository";

@Injectable()
export class MarriageService {

    constructor(
        private readonly marriageRepository: MarriageRepository,
    ){}

    async create( createMarriageDto: CreateMarriageDto ) {
        return await this.marriageRepository.create( createMarriageDto );
    }

    async findAll() {
        return await this.marriageRepository.findAll();
    }

    async findById( id: string ) {
        return await this.marriageRepository.findById( id );
    }

    async update( id: string, updateMarriageDto: UpdateMarriageDto ) {
        return await this.marriageRepository.update( id, updateMarriageDto );
    }

    async delete( id: string ) {
        return await this.marriageRepository.delete( id );
    }
    
}