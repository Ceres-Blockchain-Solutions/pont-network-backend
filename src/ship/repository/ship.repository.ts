import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShipDataEncrypted } from '../entities/shipData.entity';
import { ShipDataEncryptedDto } from '../dto/create-ship-encrypted.dto';
import { CreateShipDto } from '../dto/create-ship.dto';
import { Ship } from '../entities/ship.entity';

@Injectable()
export class ShipRepository {
  constructor(
    @InjectModel(ShipDataEncrypted.name)
    private readonly shipDataEncryptedModel: Model<ShipDataEncrypted>,
    @InjectModel(Ship.name)
    private readonly shipModel: Model<Ship>,
  ) {}

  async create(shipDataEncryptedDto: ShipDataEncryptedDto) {
    return (
      await this.shipDataEncryptedModel.create(shipDataEncryptedDto)
    ).save();
  }

  async findAll(): Promise<ShipDataEncrypted[]> {
    const ships = await this.shipDataEncryptedModel.find().exec();
    if (!ships) {
      throw new NotFoundException(`Ships not found`);
    }
    return ships.map((ship) =>
      ship.toObject({
        transform(doc, ret) {
          delete ret.__v;
          delete ret._id;
        },
      }),
    );
  }

  async addDecryptedShip(newShipDataReadings: CreateShipDto) {
    return (await this.shipModel.create(newShipDataReadings)).save();
  }

  async findAllDecrypted() {
    const ships = await this.shipModel.find().exec();
    if (!ships) {
      throw new NotFoundException(`Ships not found`);
    }
    return ships.map((ship) =>
      ship.toObject({
        transform(doc, ret) {
          delete ret.__v;
          delete ret._id;
        },
      }),
    );
  }

  async findDecryptedByID(id: string): Promise<Ship> {
    const ship = await this.shipModel.find({ id }).sort({ time: -1 }).limit(1).exec();
    return ship[0]?.toObject({
      transform(doc, ret) {
        delete ret.__v;
        delete doc._id;
        delete ret._id;
      },
    }
    );
  }

  async findAllByID(
    dataCommitmentCipher: string,
  ): Promise<ShipDataEncrypted[]> {
    const ships = await this.shipDataEncryptedModel.find({
      dataCommitmentCipher,
    });

    if (!ships) {
      throw new NotFoundException(`Ships not found`);
    }

    return ships.map((ship) =>
      ship.toObject({
        transform(doc, ret) {
          delete ret.__v;
          delete ret._id;
        },
      }),
    );
  }
}
