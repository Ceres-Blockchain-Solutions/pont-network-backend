import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ShipService } from './ship.service';
import { ShipController } from './ship.controller';
import { ShipRepository } from './repository/ship.repository';
import { Ship, ShipSchema } from './entities/ship.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ship.name, schema: ShipSchema }]),
  ],
  controllers: [ShipController],
  providers: [ShipService, ShipRepository],
})
export class ShipModule {}
