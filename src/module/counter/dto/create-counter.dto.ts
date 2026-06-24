import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateCounterDto {
   
    @IsString()
    @IsNotEmpty()
    key!: string;

    @IsNotEmpty()
    @IsNumber()
    sequence!: number;
    
}