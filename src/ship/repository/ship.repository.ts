import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ship } from '../entities/ship.entity';
import { CreateShipDto } from '../dto/create-ship.dto';
import { ShipDataEncrypted } from '../entities/shipData.entity';
import { ShipDataEncryptedDto } from '../dto/create-ship-encypted.dto';

@Injectable()
export class ShipRepository {
  constructor(
    // @InjectModel(Ship.name) private readonly shipModel: Model<Ship>,
    @InjectModel(ShipDataEncrypted.name)
    private readonly shipDataEncryptedModel: Model<ShipDataEncrypted>,
  ) {}

  // async create(createShipDto: CreateShipDto) {
  //   return (await this.shipModel.create(createShipDto)).save();
  // }

  async create(shipDataEncryptedDto: ShipDataEncryptedDto) {
    console.log(shipDataEncryptedDto);
    return (
      await this.shipDataEncryptedModel.create(shipDataEncryptedDto)
    ).save();
  }

  // async findAll(): Promise<Ship[]> {
  //   const ships = await this.shipModel.find().exec();
  //   if (!ships) {
  //     throw new NotFoundException(`Ships not found`);
  //   }
  //   return ships.map((ship) =>
  //     ship.toObject({
  //       transform(doc, ret) {
  //         delete ret.__v;
  //         delete ret._id;
  //         // delete ret.$__;
  //         // delete ret.$isNew;
  //       },
  //     }),
  //   );
  // }

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
          // delete ret.$__;
          // delete ret.$isNew;
        },
      }),
    );
  }

  // async findAllByID(shipID: string): Promise<Ship[]> {
  //   const ships = await this.shipModel.find({ shipID });

  //   if (!ships) {
  //     throw new NotFoundException(`Ships not found`);
  //   }

  //   return ships.map((ship) =>
  //     ship.toObject({
  //       transform(doc, ret) {
  //         delete ret.__v;
  //         delete ret._id;
  //       },
  //     }),
  //   );
  // }

  async findAllByID(dataCommitmentCipher: string): Promise<ShipDataEncrypted[]> {
    const ships = await this.shipDataEncryptedModel.find({ dataCommitmentCipher });

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

  

  // async findOne(shipID: number): Promise<Ship> {
  //   return await this.shipModel.findOne({ shipID }).exec();
  // }
}
