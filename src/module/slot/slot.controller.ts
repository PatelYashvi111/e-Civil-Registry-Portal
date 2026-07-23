import { Controller, Post, Get, Delete, Param, Body, Query } from '@nestjs/common';
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

  @Get('available-dates/:officeDepartmentId')
  async getAvailableDates( @Param('officeDepartmentId') officeDepartmentId: string ) {
    return this.slotService.getAvailableDates( officeDepartmentId );
  }

  @Get("available-slots")
async getAvailableSlots(
  @Query("officeDepartmentId") officeDepartmentId: string,
  @Query("slotDate") slotDate: string,
) {
  return this.slotService.getAvailableSlots(
    officeDepartmentId,
    slotDate,
  );
}
  @Post('book/:slotId')
  async bookSlot( @Param('slotId') slotId: string ) {
    return this.slotService.bookSlot(slotId);
  }

  @Get(':id')
  async findById( @Param('id') id: string ) {

    return this.slotService.findById(id);
  }

  @Delete(':id')
  async delete( @Param('id') id: string ) {
    return this.slotService.delete(id);
  }
}