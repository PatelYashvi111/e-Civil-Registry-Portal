import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleEnum } from 'src/common/enums/role.enums';

export class CreateRoleDto {

    @IsNotEmpty()
    @IsEnum(RoleEnum)
    name!: RoleEnum;

}