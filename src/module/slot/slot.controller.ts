import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { SlotService } from './slot.service';

@Controller('slot')
export class SlotController {
  
    constructor(
    private readonly slotService: SlotService,
  ) {}

  @Post('generate')
  async generateSlots( @Body() body: { officeDepartmentId: string, slotDate: string } ) {
    return this.slotService.generateSlots(
      body.officeDepartmentId,
      body.slotDate,
    );
  }

  @Get('all')
  async findAll() {
    return this.slotService.findAll();
  }

  @Get(':id')
  async findById( @Param('id') id: string ) {
    return this.slotService.findById(id);
  }

  @Get('available-dates/:officeDepartmentId')
  async getAvailableDates( @Param('officeDepartmentId') officeDepartmentId: string ) {
    return this.slotService.getAvailableDates( officeDepartmentId );
  }

  @Post('available-slots')
  async getAvailableSlots( @Body() body: { officeDepartmentId: string, slotDate: string },
  ) {
    return this.slotService.getAvailableSlots(
      body.officeDepartmentId,
      body.slotDate,
    );
  }

  @Post('book/:slotId')
  async bookSlot( @Param('slotId') slotId: string ) {
    return this.slotService.bookSlot(slotId);
  }

  @Delete(':id')
  async delete( @Param('id') id: string ) {
    return this.slotService.delete(id);
  }
}