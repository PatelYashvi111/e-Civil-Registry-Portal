import { PartialType } from '@nestjs/mapped-types';
import { CreateOfficeDepartmentDto } from './create-officeDepartment.dto';

export class UpdateOfficeDepartmentDto extends PartialType(CreateOfficeDepartmentDto) {}