import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ShipDataEncrypted extends Document {
  @Prop({ required: true })
  dataCommitmentCipher: string;

  @Prop({ required: true })
  tag: string;

  @Prop({ required: true })
  iv: string;

  @Prop({ required: true })
  timestamp: number;
}

export const ShipDataEncryptedSchema =
  SchemaFactory.createForClass(ShipDataEncrypted);
