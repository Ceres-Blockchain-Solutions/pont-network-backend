import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CargoStatus } from '../dto/create-ship.dto';

export class Coordinate {
  @Prop({ required: true, min: -90, max: 90 })
  lat: number;
  @Prop({ required: true, min: -180, max: 180 })
  long: number;
}

@Schema()
export class Ship extends Document {
  @Prop({ required: true, minlength: 32, maxlength: 44 })
  id: string;

  @Prop({ required: true })
  gps: Coordinate;

  @Prop({ required: true, min: 0 })
  mil: number;

  @Prop({ required: true, min: 0, max: 100 })
  eng: number;

  @Prop({ required: true, min: 0, max: 100 })
  fuel: number;

  @Prop({ required: true })
  sea: string;

  @Prop({ required: true, min: -2, max: 35 })
  sst: number;

  @Prop({ required: true, min: -50, max: 50 })
  air: number;

  @Prop({ required: true, min: 0, max: 100 })
  hum: number;

  @Prop({ required: true, min: 800, max: 1100 })
  bar: number;

  @Prop({ required: true })
  cargo: CargoStatus;

  @Prop({ required: true, default: Date.now })
  time: number;
}

export const ShipSchema = SchemaFactory.createForClass(Ship);
