import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CargoStatus } from '../dto/create-ship.dto';

@Schema()
export class Ship extends Document {
  @Prop({ required: true })
  shipID: number;

  @Prop({ required: true })
  gpsLocation: number[];

  @Prop({ required: true })
  mileage: number[];

  @Prop({ required: true })
  engineLoad: number[];

  @Prop({ required: true })
  fuelLevel: number[];

  @Prop({ required: true })
  seaState: string[];

  @Prop({ required: true })
  seaSurfaceTemperature: number[];

  @Prop({ required: true })
  airTemperature: number[];

  @Prop({ required: true })
  humidity: number[];

  @Prop({ required: true })
  barometricPressure: number[];

  @Prop({ required: true })
  cargoStatus: CargoStatus[];

  @Prop({ required: true, default: Date.now })
  timestamp: number[];
}

export const ShipSchema = SchemaFactory.createForClass(Ship);
