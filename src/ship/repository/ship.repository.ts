import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShipDataEncrypted } from '../entities/shipData.entity';
import { ShipDataEncryptedDto } from '../dto/create-ship-encrypted.dto';

@Injectable()
export class ShipRepository {
  constructor(
    @InjectModel(ShipDataEncrypted.name)
    private readonly shipDataEncryptedModel: Model<ShipDataEncrypted>,
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
