import { Injectable } from '@nestjs/common';
import { CargoStatus, CreateShipDto } from './dto/create-ship.dto';
import { ShipRepository } from './repository/ship.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

import * as crypto from 'crypto';
import * as cbor from 'cbor';
import { ShipDataEncryptedDto } from './dto/create-ship-encypted.dto';
import { ShipDataEncrypted } from './entities/shipData.entity';
// import { Ship } from './entities/ship.entity';
// import * as anchor from '@coral-xyz/anchor';
// import { Connection, PublicKey, Keypair } from '@solana/web3.js';
// import { Program } from '@coral-xyz/anchor';
import { currentShip } from './constants/currentShip';

@Injectable()
export class ShipService {
  constructor(private readonly shipRepository: ShipRepository) {}

  private mileage = 0; // Initialize mileage
  private fuelLevel = 100; // Initialize fuel level to 100 (full)
  private shipQueue = [];
  private currentObject: CreateShipDto = currentShip;

  // async create(createShipDto: CreateShipDto) {
  //   this.mileage = createShipDto.mileage;
  //   return (await this.shipRepository.create(createShipDto)).toObject();
  // }

  async create(shipDataEncryptedDto: ShipDataEncryptedDto) {
    return (await this.shipRepository.create(shipDataEncryptedDto)).toObject();
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  // @Cron(CronExpression.EVERY_10_MINUTES)
  async fetchSensorData() {
    const enums = Object.keys(CargoStatus);
    // Generate random values for each field except mileage and fuel level
    const gpsLocation = {
      latitude: this.randomFloatInRange(
        this.currentObject.gpsLocation.latitude - 5,
        this.currentObject.gpsLocation.latitude + 5,
      ), // Latitude range -90 to 90
      longitude: this.randomFloatInRange(
        this.currentObject.gpsLocation.longitude - 5,
        this.currentObject.gpsLocation.longitude + 5,
      ), // Longitude range -180 to 180
    };

    // Increment mileage and decrement fuel level
    this.mileage += this.randomFloatInRange(0.1, 2.0); // Increment mileage by a small random value
    this.fuelLevel -= this.randomFloatInRange(0.1, 1.0); // Decrement fuel level by a small random value
    if (this.fuelLevel < 0) this.fuelLevel = 0; // Ensure fuel level doesn't go negative

    const createShipDto: CreateShipDto = {
      shipID: '2kBcbo8q4m2BQHBM6YXdqzKvs3jngDKeuasLUbjpzLbw',
      gpsLocation: gpsLocation,
      mileage: this.mileage,
      engineLoad: this.randomFloatInRange(10, 100),
      fuelLevel: this.fuelLevel,
      seaState: this.randomSeaState(),
      seaSurfaceTemperature: this.randomFloatInRange(
        this.currentObject.seaSurfaceTemperature - 2,
        this.currentObject.seaSurfaceTemperature + 2,
      ),
      airTemperature: this.randomFloatInRange(
        this.currentObject.airTemperature - 2,
        this.currentObject.airTemperature + 2,
      ),
      humidity: this.randomFloatInRange(
        this.currentObject.humidity - 2,
        this.currentObject.humidity + 2,
      ),
      barometricPressure: this.randomFloatInRange(
        this.currentObject.barometricPressure - 2,
        this.currentObject.barometricPressure + 2,
      ),
      cargoStatus: CargoStatus[enums[Math.floor(Math.random() * enums.length)]],
    };

    this.currentObject = createShipDto;

    // add condition
    if (this.shipQueue.length < 5) {
      this.shipQueue.push({ ...createShipDto, timestamp: new Date() });
    } else {
      await Promise.all(
        this.shipQueue.map(async ({ timestamp, ...createShipDto }) => {
          // send data to chain
          const ciphertext = await this.sendToProgram(createShipDto);

          console.log(ciphertext);

          const temp: ShipDataEncryptedDto = {
            dataCommitmentCipher: ciphertext,
            timestamp,
          };

          return (await this.shipRepository.create(temp)).toObject();

          // return (await this.shipRepository.create(createShipDto)).toObject();
        }),
      );

      this.shipQueue = [];
    }
  }

  private encrypt(plaintext, key, iv) {
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    const tag = cipher.getAuthTag().toString('hex');

    return {
      ciphertext,
      tag,
      iv,
    };
  }

  // Helper function to generate a random float within a range
  private randomFloatInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // Helper function to generate a random sea state
  private randomSeaState(): string {
    const states = [
      'calm',
      'slight',
      'moderate',
      'rough',
      'very rough',
      'high',
      'very high',
      'phenomenal',
    ];
    return states[Math.floor(Math.random() * states.length)];
  }

  async sendToProgram(createShipDto: CreateShipDto): Promise<string> {
    const serialized = cbor.encode(createShipDto);
    const data = Buffer.from(serialized);

    const iv = new Uint32Array(3);
    crypto.getRandomValues(iv);
    const masterKey = new Uint32Array(8);
    crypto.getRandomValues(masterKey);

    const encryptedData = this.encrypt(data, masterKey, iv);

    // const ciphertext = encryptedData.ciphertext;
    // const tag = encryptedData.tag;

    // const serializedEncryptedData = this.serializeEncryptedData(encryptedData);
    // const ciphertextBuffer = serializedEncryptedData.ciphertext;
    // const tagBuffer = serializedEncryptedData.tag;
    // const ivBuffer = serializedEncryptedData.iv;
    // const dataTimestamp = Date.now();

    // const ship = anchor.web3.Keypair.generate();

    // const program = anchor.workspace.PontNetwork as Program<PontNetwork>;

    // const [shipAccountAddress, bump1] = PublicKey.findProgramAddressSync(
    // 	[Buffer.from("ship_account"), ship.publicKey.toBuffer()],
    // 	program.programId
    // );

    // const shipAccount = await program.account.shipAccount.fetch(shipAccountAddress);

    // const [dataAccount, bump2] = PublicKey.findProgramAddressSync(
    // 	[Buffer.from("data_account"), ship.publicKey.toBuffer(), new anchor.BN(shipAccount.dataAccounts.length, "le").toArrayLike(Buffer, "le", 8)],
    // 	program.programId
    // );

    // const tx = await program.methods
    // 	.addDataFingerprint(ciphertextBuffer, tagBuffer, ivBuffer, new anchor.BN(dataTimestamp))
    // 	.accountsStrict({
    // 		dataAccount,
    // 		ship: ship.publicKey,
    // 	})
    // 	.signers([ship])
    // 	.rpc();

    return encryptedData.ciphertext;
  }

  // async findAllByID(shipID: string): Promise<Ship[]> {
  //   return await this.shipRepository.findAllByID(shipID);
  // }

  async findAllByID(
    dataCommitmentCipher: string,
  ): Promise<ShipDataEncrypted[]> {
    return await this.shipRepository.findAllByID(dataCommitmentCipher);
  }

  // async findAll(): Promise<Ship[]> {
  //   return await this.shipRepository.findAll();
  // }

  async findAll(): Promise<ShipDataEncrypted[]> {
    return await this.shipRepository.findAll();
  }

  serializeEncryptedData(encryptedData: {
    ciphertext: string;
    tag: string;
    iv: Uint32Array;
  }): {
    ciphertext: Buffer;
    tag: Buffer;
    iv: Buffer;
  } {
    const ciphertextBytes = Buffer.from(encryptedData.ciphertext, 'hex');
    const tagBytes = Buffer.from(encryptedData.tag, 'hex');
    const ivBytes = encryptedData.iv.buffer;

    // const totalLength = ciphertextBytes.length + tagBytes.length + ivBytes.length;
    // const serializedData = new Uint8Array(totalLength);

    // serializedData.set(ciphertextBytes, 0);
    // serializedData.set(tagBytes, ciphertextBytes.length);
    // serializedData.set(ivBytes, ciphertextBytes.length + tagBytes.length);

    // return serializedData;
    return {
      ciphertext: ciphertextBytes,
      tag: tagBytes,
      iv: Buffer.from(ivBytes),
    };
  }
}
