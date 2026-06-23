import { Injectable } from "@nestjs/common";
import { CreateBirthDto } from "./dto/create-birth.dto";
import { UpdateBirthDto } from "./dto/update-birth.dto";
import { BirthRepository } from "./birth.repositroy";

@Injectable()
export class BirthService {

    constructor(
        private readonly birthRepository: BirthRepository,
    ){}

    async create( createBirthDto: CreateBirthDto ) {
        return await this.birthRepository.create( createBirthDto );
    }

    async findAll() {
        return await this.birthRepository.findAll();
    }

    async findById( id: string ) {
        return await this.birthRepository.findById( id );
    }

    async update( id: string, updateBirthDto: UpdateBirthDto ) {
        return await this.birthRepository.update( id, updateBirthDto );
    }

    async delete( id: string ) {
        return await this.birthRepository.delete( id );
    }
    
}