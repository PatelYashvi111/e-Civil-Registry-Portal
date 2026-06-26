import { IsString, IsNotEmpty, IsMongoId, IsDateString, IsNumber, IsBoolean } from "class-validator";

export class CreateSlotDto {
        @IsNotEmpty()
        @IsMongoId()
        officeDepartmentId!: string;

        @IsNotEmpty()
        @IsDateString()
        slotDate!: string;

        @IsNotEmpty()
        @IsString()
        startTime!: string;

        @IsNotEmpty()
        @IsString()
        endTime!: string;

        @IsNotEmpty()
        @IsNumber()
        maxCapacity!: number;

        @IsNotEmpty()
        @IsNumber()
        bookCount!: number;

        @IsNotEmpty()
        @IsBoolean()
        isAvailable!: boolean;

}
