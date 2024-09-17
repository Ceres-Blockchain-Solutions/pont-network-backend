import { Injectable } from '@nestjs/common';
import { ShipRepository } from './repository/ship.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ShipDataEncryptedDto } from './dto/create-ship-encypted.dto';
import { ShipDataEncrypted } from './entities/shipData.entity';
import {
  createShipObject,
  encryptShip,
  sendToProgram,
} from './utils/helpers/generateValues';
import { numberOfReadings } from './utils/constants/currentShip';

@Injectable()
export class ShipService {
  constructor(private readonly shipRepository: ShipRepository) {}

  private shipQueue = [];
  private shipEncryptedDataQueue = [];

  async create(shipDataEncryptedDto: ShipDataEncryptedDto) {
    return (await this.shipRepository.create(shipDataEncryptedDto)).toObject();
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async fetchSensorData() {
    const newShipDataReadings = await createShipObject();

    if (this.shipQueue.length < numberOfReadings) {
      this.shipQueue.push({ ...newShipDataReadings, timestamp: new Date() });
    } else {
      let encryptedShipString = '';

      await Promise.all(
        this.shipQueue.map(async ({ timestamp, ...createShipDto }) => {
          const ciphertext = await encryptShip(createShipDto);

          encryptedShipString += ciphertext;

          console.log(ciphertext);

          const temp: ShipDataEncryptedDto = {
            dataCommitmentCipher: ciphertext,
            timestamp,
          };

          return (await this.shipRepository.create(temp)).toObject();
        }),
      );

      // add check for internet/chain connection
      if (true) {
        await Promise.all(
          this.shipEncryptedDataQueue.map(async (temp) => {
            await sendToProgram(temp);
          }),
        );

        this.shipEncryptedDataQueue = [];
      } else {
        this.shipEncryptedDataQueue.push(encryptedShipString);
        console.log(encryptedShipString);
      }

      this.shipQueue = [];
    }
  }

  async findAllByID(
    dataCommitmentCipher: string,
  ): Promise<ShipDataEncrypted[]> {
    return await this.shipRepository.findAllByID(dataCommitmentCipher);
  }

  async findAll(): Promise<ShipDataEncrypted[]> {
    return await this.shipRepository.findAll();
  }
}
