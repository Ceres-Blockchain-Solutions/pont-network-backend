import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ShipService } from './ship.service';
import { ShipController } from './ship.controller';
import { ShipRepository } from './repository/ship.repository';
import {
  ShipDataEncrypted,
  ShipDataEncryptedSchema,
} from './entities/shipData.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShipDataEncrypted.name, schema: ShipDataEncryptedSchema },
    ]),
  ],
  controllers: [ShipController],
  providers: [ShipService, ShipRepository],
})
export class ShipModule {}
