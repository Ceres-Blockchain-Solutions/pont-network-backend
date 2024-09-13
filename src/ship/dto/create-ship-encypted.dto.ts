import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ShipDataEncryptedDto {
  @IsNotEmpty()
  @IsString()
  dataCommitmentCipher: string;

  @IsNotEmpty()
  @IsNumber()
  timestamp: number;
}
