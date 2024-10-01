import { CargoStatus, CreateShipDto } from 'src/ship/dto/create-ship.dto';
import { currentShip } from '../../utils/constants/currentShip';

import * as crypto from 'crypto';
import * as cbor from 'cbor';

export const numberOfReadings = 4;

let mileage = 0; // Initialize mileage
let fuelLevel = 100; // Initialize fuel level to 100 (full)
let currentObject: CreateShipDto = currentShip;

export function encrypt(plaintext, key, iv) {
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
export function randomFloatInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// Helper function to generate a random sea state
export function randomSeaState(): string {
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

export async function createShipObject(): Promise<CreateShipDto> {
  const enums = Object.keys(CargoStatus);
  // Generate random values for each field except mileage and fuel level
  const gpsLocation = {
    latitude: randomFloatInRange(
      currentObject.gpsLocation.latitude - 5,
      currentObject.gpsLocation.latitude + 5,
    ), // Latitude range -90 to 90
    longitude: randomFloatInRange(
      currentObject.gpsLocation.longitude - 5,
      currentObject.gpsLocation.longitude + 5,
    ), // Longitude range -180 to 180
  };

  // Increment mileage and decrement fuel level
  mileage += randomFloatInRange(0.1, 2.0); // Increment mileage by a small random value
  fuelLevel -= randomFloatInRange(0.1, 1.0); // Decrement fuel level by a small random value
  if (fuelLevel < 0) fuelLevel = 0; // Ensure fuel level doesn't go negative

  const createShipDto: CreateShipDto = {
    shipID: '2kBcbo8q4m2BQHBM6YXdqzKvs3jngDKeuasLUbjpzLbw',
    gpsLocation: gpsLocation,
    mileage: mileage,
    engineLoad: randomFloatInRange(10, 100),
    fuelLevel: fuelLevel,
    seaState: randomSeaState(),
    seaSurfaceTemperature: randomFloatInRange(
      currentObject.seaSurfaceTemperature - 2,
      currentObject.seaSurfaceTemperature + 2,
    ),
    airTemperature: randomFloatInRange(
      currentObject.airTemperature - 2,
      currentObject.airTemperature + 2,
    ),
    humidity: randomFloatInRange(
      currentObject.humidity - 2,
      currentObject.humidity + 2,
    ),
    barometricPressure: randomFloatInRange(
      currentObject.barometricPressure - 2,
      currentObject.barometricPressure + 2,
    ),
    cargoStatus: CargoStatus[enums[Math.floor(Math.random() * enums.length)]],
  };

  currentObject = createShipDto;

  return createShipDto;
}

export async function encryptShip(createShipsDto: CreateShipDto[]) {
  const serialized = cbor.encode(createShipsDto);
  const data = Buffer.from(serialized);

  const iv = new Uint32Array(3);
  crypto.getRandomValues(iv);
  const masterKey = new Uint32Array(8);
  crypto.getRandomValues(masterKey);

  const encryptedData = encrypt(data, masterKey, iv);

  return encryptedData;
}

export function serializeEncryptedData(encryptedData: {
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

  return {
    ciphertext: ciphertextBytes,
    tag: tagBytes,
    iv: Buffer.from(ivBytes),
  };
}

export async function sendToProgram(encryptedData) {
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
