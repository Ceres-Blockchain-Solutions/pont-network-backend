import { Injectable } from '@nestjs/common';
import { ShipRepository } from './repository/ship.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ShipDataEncryptedDto } from './dto/create-ship-encrypted.dto';
import { ShipDataEncrypted } from './entities/shipData.entity';
import {
  createShipObject,
  encryptShip,
  sendToProgram,
  numberOfReadings,
} from './utils/helpers/generateValues';
import {
  loadEncryptedShipQueueFromFile,
  saveEncryptedShipQueueToFile,
} from './utils/helpers/fileHelpers';

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
    this.shipEncryptedDataQueue = loadEncryptedShipQueueFromFile();
    const newShipDataReadings = await createShipObject();

    if (this.shipQueue.length < numberOfReadings) {
      // this.shipQueue.push({ ...newShipDataReadings, timestamp: new Date() });
      this.shipQueue.push({ ...newShipDataReadings });
    } else {
      let encryptedData = await encryptShip(this.shipQueue);
      encryptedData.iv = Buffer.from(encryptedData.iv.buffer).toString('hex');

      const temp: ShipDataEncryptedDto = {
        dataCommitmentCipher: encryptedData.ciphertext,
        iv: encryptedData.iv,
        tag: encryptedData.tag,
        timestamp: Date.now(),
      };

      (await this.shipRepository.create(temp)).toObject();

      // add check for internet/chain connection
      this.shipEncryptedDataQueue.push(encryptedData);
      if (true) {
        await Promise.all(
          this.shipEncryptedDataQueue.map(async (temp) => {
            await sendToProgram(temp);
          }),
        );
        this.shipEncryptedDataQueue = [];
      } else {
        // this.shipEncryptedDataQueue.push(encryptedData);
      }

      console.log(this.shipEncryptedDataQueue);
      saveEncryptedShipQueueToFile(this.shipEncryptedDataQueue);

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
