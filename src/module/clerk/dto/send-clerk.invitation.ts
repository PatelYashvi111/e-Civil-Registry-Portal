import { IsMongoId, IsNotEmpty } from 'class-validator';

export class SendClerkInvitationDto {
  @IsNotEmpty()
  @IsMongoId()
  clerkId!: string;
}