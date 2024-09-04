import { PartialType } from '@nestjs/mapped-types';
import { CargoStatus, CreateShipDto } from './create-ship.dto';

import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { Coordinate } from '../entities/ship.entity';

export class UpdateShipDto extends PartialType(CreateShipDto) {
  @IsNotEmpty()
  gpsLocation: Coordinate;

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
