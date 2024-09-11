import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';

export class ShipDataEncryptedDto {
  @IsNotEmpty()
  @IsString()
  dataCommitmentCipher: string;
}
