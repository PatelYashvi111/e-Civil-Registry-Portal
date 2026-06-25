import { Injectable } from '@nestjs/common';
import { SlotRepository } from './slot.repository';
import { UserRepository } from '../user/user.repository';
import { RoleRepository } from '../role/role.repository';

@Injectable()
export class SlotService {
  
  constructor(
    private readonly slotRepository: SlotRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  async generateSlots(officeDepartmentId: string, slotDate: string) {
    return await this.slotRepository.createMany([]);
  }

  async findAll() {
    return await this.slotRepository.findAll();
  }

  async findById(id: string) {
    return await this.slotRepository.findById(id);
  }

  async getAvailableDates(officeDepartmentId: string) {
    return await this.slotRepository.findAvailableDates(officeDepartmentId);
  }

  async getAvailableSlots(officeDepartmentId: string, slotDate: string) {
    return await this.slotRepository.findAvailableSlots(
      officeDepartmentId,
      new Date(slotDate),
    );
  }

  async bookSlot(slotId: string) {
    return await this.slotRepository.update(slotId, {});
  }

  async delete(id: string) {
    return await this.slotRepository.delete(id);
  }
}