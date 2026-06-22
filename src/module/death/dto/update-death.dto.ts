import { PartialType } from "@nestjs/mapped-types";
import { CreateDeathDto } from "./create-death.dto";

export class UpdateDeathDto extends PartialType(CreateDeathDto) {}