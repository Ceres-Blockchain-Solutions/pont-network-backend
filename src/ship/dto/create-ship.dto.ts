import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { Coordinate } from '../entities/ship.entity';

export enum CargoStatus {
  INTRANSIT = 'INTRANSIT',
  LOADED = 'LOADED',
  DELIVERED = 'DELIVERED',
}

export class CreateShipDto {
  @IsNotEmpty()
  @IsString()
  id: string; // shipID -> id

  @IsNotEmpty()
  gps: Coordinate; // gpsLocation -> gps

  @IsNotEmpty()
  @IsNumber()
  mil: number; // mileage -> mil

  @IsNotEmpty()
  @IsNumber()
  eng: number; // engineLoad -> eng

  @IsNotEmpty()
  @IsNumber()
  fuel: number; // fuelLevel -> fuel

  @IsNotEmpty()
  @IsString()
  sea: string; // seaState -> sea

  @IsNotEmpty()
  @IsNumber()
  sst: number; // seaSurfaceTemperature -> sst

  @IsNotEmpty()
  @IsNumber()
  air: number; // airTemperature -> air

  @IsNotEmpty()
  @IsNumber()
  hum: number; // humidity -> hum

  @IsNotEmpty()
  @IsNumber()
  bar: number; // barometricPressure -> bar

  @IsNotEmpty()
  @IsEnum(CargoStatus)
  cargo: CargoStatus; // cargoStatus -> cargo
}
