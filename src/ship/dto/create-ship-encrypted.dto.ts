import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ShipDataEncryptedDto {
  @IsNotEmpty()
  @IsString()
  dataCommitmentCipher: string;

  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsNotEmpty()
  iv: string;

  @IsNotEmpty()
  @IsNumber()
  timestamp: number;
}
