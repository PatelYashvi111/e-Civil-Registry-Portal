import { PartialType } from '@nestjs/mapped-types';
import { CreateAadharDto } from './create-aadhar.dto';

export class UpdateAadharDto extends PartialType(CreateAadharDto) {}
