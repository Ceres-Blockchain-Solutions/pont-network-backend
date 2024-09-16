import { Injectable } from '@nestjs/common';
import { ShipRepository } from './repository/ship.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ShipDataEncryptedDto } from './dto/create-ship-encypted.dto';
import { ShipDataEncrypted } from './entities/shipData.entity';
// import { Ship } from './entities/ship.entity';
// import * as anchor from '@coral-xyz/anchor';
// import { Connection, PublicKey, Keypair } from '@solana/web3.js';
// import { Program } from '@coral-xyz/anchor';
import { createShipObject, encryptShip } from './utils/helpers/generateValues';

@Injectable()
export class ShipService {
  constructor(private readonly shipRepository: ShipRepository) {}

  private shipQueue = [];
  private shipEncryptedDataQueue = [];

  // async create(createShipDto: CreateShipDto) {
  //   this.mileage = createShipDto.mileage;
  //   return (await this.shipRepository.create(createShipDto)).toObject();
  // }

  async create(shipDataEncryptedDto: ShipDataEncryptedDto) {
    return (await this.shipRepository.create(shipDataEncryptedDto)).toObject();
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async fetchSensorData() {
    const newShipDataReadings = await createShipObject();

    // add 120
    if (this.shipQueue.length < 4) {
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

          // return (await this.shipRepository.create(createShipDto)).toObject();
        }),
      );

      // add check for internet/chain connection
      if (false) {
        await Promise.all(
          this.shipEncryptedDataQueue.map(async (temp) => {
            await this.sendToProgram(temp);
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

  async sendToProgram(encryptedShips: string) {
    // const ciphertext = encryptedData.ciphertext;
    // const tag = encryptedData.tag;
    // const serializedEncryptedData = this.serializeEncryptedData(encryptedData);
    // const ciphertextBuffer = serializedEncryptedData.ciphertext;
    // const tagBuffer = serializedEncryptedData.tag;
    // const ivBuffer = serializedEncryptedData.iv;
    // const dataTimestamp = Date.now();
    // const ship = anchor.web3.Keypair.generate();
    // const program = require('./constants/idl/pont_network.json');
    // const [shipAccountAddress, bump1] = PublicKey.findProgramAddressSync(
    // 	[Buffer.from("ship_account"), ship.publicKey.toBuffer()],
    // 	program.programId
    // );
    // const shipAccount = await program.account.shipAccount.fetch(shipAccountAddress);
    // const [dataAccount, bump2] = PublicKey.findProgramAddressSync(
    // 	[Buffer.from("data_account"), ship.publicKey.toBuffer(), new anchor.BN(shipAccount.dataAccounts.length - 1, "le").toArrayLike(Buffer, "le", 8)],
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
}
