import { Injectable } from "@nestjs/common";
import { CreateDeathDto } from "./dto/create-death.dto";
import { UpdateDeathDto } from "./dto/update-death.dto";
import { DeathRepository } from "./death.repository";

@Injectable()
export class DeathService {

    constructor(
        private readonly deathRepository: DeathRepository,
    ){}

    async create( createDeathDto: CreateDeathDto ) {
        return await this.deathRepository.create( createDeathDto );
    }

    async findAll() {
        return await this.deathRepository.findAll();
    }

    async findById( id: string ) {
        return await this.deathRepository.findById( id );
    }

    async update( id: string, updateDeathDto: UpdateDeathDto ) {
        return await this.deathRepository.update( id, updateDeathDto );
    }

    async delete( id: string ) {
        return await this.deathRepository.delete( id );
    }
    
}