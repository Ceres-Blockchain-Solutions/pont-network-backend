import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CargoStatus } from '../dto/create-ship.dto';

export class Coordinate {
  @Prop({ required: true, min: -90, max: 90 })
  latitude: number;
  @Prop({ required: true, min: -180, max: 180 })
  longitude: number;
}

@Schema()
export class Ship extends Document {
  @Prop({ required: true, minlength: 32, maxlength: 44 })
  shipID: string;

  @Prop({ required: true })
  gpsLocation: Coordinate;

  @Prop({ required: true, min: 0 })
  mileage: number;

  @Prop({ required: true, min: 0, max: 100 })
  engineLoad: number;

  @Prop({ required: true, min: 0, max: 100 })
  fuelLevel: number;

  @Prop({ required: true })
  seaState: string;

  @Prop({ required: true, min: -2, max: 35 })
  seaSurfaceTemperature: number;

  @Prop({ required: true, min: -50, max: 50 })
  airTemperature: number;

  @Prop({ required: true, min: 0, max: 100 })
  humidity: number;

  @Prop({ required: true, min: 800, max: 1100 })
  barometricPressure: number;

  @Prop({ required: true })
  cargoStatus: CargoStatus;

  @Prop({ required: true, default: Date.now })
  timestamp: number;
}

export const ShipSchema = SchemaFactory.createForClass(Ship);
