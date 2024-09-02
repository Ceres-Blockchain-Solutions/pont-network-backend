import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';

export enum CargoStatus {
  INTRANSIT = 'INTRANSIT',
  LOADED = 'LOADED',
  DELIVERED = 'DELIVERED',
}

export class CreateShipDto {
  @IsNotEmpty()
  @IsNumber()
  shipID: number;

  @IsNotEmpty()
  @IsNumber()
  gpsLocation: number;

  @IsNotEmpty()
  @IsNumber()
  mileage: number;

  @IsNotEmpty()
  @IsNumber()
  engineLoad: number;

  @IsNotEmpty()
  @IsNumber()
  fuelLevel: number;

  @IsNotEmpty()
  @IsString()
  seaState: string;

  @IsNotEmpty()
  @IsNumber()
  seaSurfaceTemperature: number;

  @IsNotEmpty()
  @IsNumber()
  airTemperature: number;

  @IsNotEmpty()
  @IsNumber()
  humidity: number;

  @IsNotEmpty()
  @IsNumber()
  barometricPressure: number;

  @IsNotEmpty()
  @IsEnum(CargoStatus)
  cargoStatus: CargoStatus;
}
