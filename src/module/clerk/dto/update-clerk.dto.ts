import { PartialType } from "@nestjs/mapped-types";
import { CreateClerkDto } from "./create-clerk.dto";

export class UpdateClerkDto extends PartialType(CreateClerkDto) {}