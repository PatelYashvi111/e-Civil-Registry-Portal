import { RoleEnum } from "src/common/enums/role.enums";

export interface JwtPayload {
    userId: string;
    email: string;
    role: RoleEnum;
}