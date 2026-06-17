import { IsString, IsEnum } from 'class-validator';
import { RoleEnum } from 'src/common/enums/role.enums';

export class RoleDto {

    @IsString()
    @IsEnum(RoleEnum)
    name!: RoleEnum;

}