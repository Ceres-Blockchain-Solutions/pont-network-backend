import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ShipService } from './ship.service';
import { ShipController } from './ship.controller';
import { ShipRepository } from './repository/ship.repository';
import {
  ShipDataEncrypted,
  ShipDataEncryptedSchema,
} from './entities/shipData.entity';
import { Ship, ShipSchema } from './entities/ship.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShipDataEncrypted.name, schema: ShipDataEncryptedSchema },
    ]),
    MongooseModule.forFeature([
      { name: Ship.name, schema: ShipSchema },
    ]),
  ],
  controllers: [ShipController],
  providers: [ShipService, ShipRepository],
})
export class ShipModule {}
