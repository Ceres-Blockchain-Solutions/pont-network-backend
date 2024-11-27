import { Injectable, OnModuleInit } from '@nestjs/common';
import { ShipRepository } from './repository/ship.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ShipDataEncryptedDto } from './dto/create-ship-encrypted.dto';
import { ShipDataEncrypted } from './entities/shipData.entity';
import {
  createShipObject,
  encryptShip,
  sendToProgram,
  numberOfReadings,
  sendToProgramTest,
  createShipFromLocationAndId,
  randomFloatInRange,
} from './utils/helpers/generateValues';
import {
  loadEncryptedShipQueueFromFile,
  saveEncryptedShipQueueToFile,
} from './utils/helpers/fileHelpers';
import { Coordinate, Ship } from './entities/ship.entity';

@Injectable()
export class ShipService implements OnModuleInit {
  constructor(private readonly shipRepository: ShipRepository) { }

  private shipQueue = [];
  private shipEncryptedDataQueue = [];

  async create(shipDataEncryptedDto: ShipDataEncryptedDto) {
    return (await this.shipRepository.create(shipDataEncryptedDto)).toObject();
  }

  onModuleInit() {
    this.setupFirstDataAccount();
  }

  private async setupFirstDataAccount() {
    const startingTime = Date.now() - 50000000;
    for (let batch = 0; batch < 15; batch++) {
      for (let i = 0; i < 4; i++) {
        let newShipDataReadings = await createShipObject();
        newShipDataReadings.time = startingTime + (batch + 1) * 20000 + (i + 1) * 5000;
        this.shipQueue.push({ ...newShipDataReadings });
      }

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
            await sendToProgramTest(temp);
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

  async createDecryptedShip() {
    const positions = [
      { id: "11111111111111111111111111111111111", lat: -45, lng: -50 },
      { id: "22222222222222222222222222222222222", lat: 5, lng: 150 },
      { id: "33333333333333333333333333333333333", lat: -45, lng: 100 },
    ];

    await Promise.all(
      positions.map(async (position) => {
        const newShipDataReadings = await createShipFromLocationAndId(
          position.id,
          position.lat,
          position.lng
        );
        await this.shipRepository.addDecryptedShip(newShipDataReadings);
      })
    );
  }
  
  @Cron(CronExpression.EVERY_SECOND)
  async updateDecryptedShip() {
    const ids = ["11111111111111111111111111111111111", "22222222222222222222222222222222222", "33333333333333333333333333333333333"];

    const ships = await Promise.all(
      ids.map((id) => this.shipRepository.findDecryptedByID(id))
    );

    const gpsLocations = ships.map((ship) => ({
      lat: randomFloatInRange(ship.gps.lat - 2, ship.gps.lat + 2),
      long: randomFloatInRange(ship.gps.long - 2, ship.gps.long + 2),
    }));

    await Promise.all(
      ships.map((ship, index) => 
        this.shipRepository.addDecryptedShip({
          ...ship,
          gps: gpsLocations[index]
        })
      )
    );
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async fetchSensorData() {
    this.shipEncryptedDataQueue = loadEncryptedShipQueueFromFile();
    const newShipDataReadings = await createShipObject();

    // await this.shipRepository.addDecryptedShip(newShipDataReadings);

    this.shipQueue.push({ ...newShipDataReadings });
    if (this.shipQueue.length < numberOfReadings) {
      // this.shipQueue.push({ ...newShipDataReadings, timestamp: new Date() });
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

      // console.log(this.shipEncryptedDataQueue);
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

  async findAllDecrypted() {
    return await this.shipRepository.findAllDecrypted();
  }
}
