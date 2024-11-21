import { CargoStatus, CreateShipDto } from 'src/ship/dto/create-ship.dto';
import { currentShip } from '../../utils/constants/currentShip';

import * as crypto from 'crypto';
import * as cbor from 'cbor';
import { Connection, PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import IDL from "../constants/idl/pont_network.json"
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

export const numberOfReadings = 4;

let mileage = 0; // Initialize mileage
let fuelLevel = 100; // Initialize fuel level to 100 (full)
let currentTime = Date.now();
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
    lat: randomFloatInRange(
      currentObject.gps.lat - 5,
      currentObject.gps.lat + 5,
    ), // Latitude range -90 to 90
    long: randomFloatInRange(
      currentObject.gps.long - 5,
      currentObject.gps.long + 5,
    ), // Longitude range -180 to 180
  };

  // Increment mileage and decrement fuel level
  mileage += randomFloatInRange(0.1, 2.0); // Increment mileage by a small random value
  fuelLevel -= randomFloatInRange(0.1, 1.0); // Decrement fuel level by a small random value
  currentTime += 5000;
  if (fuelLevel < 0) fuelLevel = 0; // Ensure fuel level doesn't go negative

  const createShipDto: CreateShipDto = {
    id: '2kBcbo8q4m2BQHBM6YXdqzKvs3jngDKeuasLUbjpzLbw',
    gps: gpsLocation,
    mil: mileage,
    eng: randomFloatInRange(10, 100),
    fuel: fuelLevel,
    sea: randomSeaState(),
    sst: randomFloatInRange(
      currentObject.sst - 2,
      currentObject.sst + 2,
    ),
    air: randomFloatInRange(
      currentObject.air - 2,
      currentObject.air + 2,
    ),
    hum: randomFloatInRange(
      currentObject.hum - 2,
      currentObject.hum + 2,
    ),
    bar: randomFloatInRange(
      currentObject.bar - 2,
      currentObject.bar + 2,
    ),
    cargo: CargoStatus[enums[Math.floor(Math.random() * enums.length)]],
    time: currentTime,
  };

  currentObject = createShipDto;

  return createShipDto;
}

export async function encryptShip(createShipsDto: CreateShipDto[]) {
  console.log("CreateShipsDto: ", createShipsDto);
  // print size of all properties of createShipsDto

  const serialized = cbor.encode(createShipsDto);
  console.log("Serialized: ", serialized.length);
  const data = Buffer.from(serialized);

  const iv = new Uint32Array(3);
  crypto.getRandomValues(iv);
  const masterKey = new Uint8Array(32);
  // crypto.getRandomValues(masterKey);

  const encryptedData = encrypt(data, masterKey, iv);

  return encryptedData;
}

export function serializeEncryptedData(encryptedData: {
  ciphertext: string;
  tag: string;
  iv: string;
}): {
  ciphertext: Buffer;
  tag: Buffer;
  iv: Buffer;
} {
  const ciphertextBytes = Buffer.from(encryptedData.ciphertext, 'hex');
  const tagBytes = Buffer.from(encryptedData.tag, 'hex');
  const ivBytes = Buffer.from(encryptedData.iv, 'hex');

  return {
    ciphertext: ciphertextBytes,
    tag: tagBytes,
    iv: ivBytes,
  };
}

export async function sendToProgram(encryptedData) {
  console.log('Sending encrypted data to program: ', encryptedData);

  const ciphertext = encryptedData.ciphertext;
  const tag = encryptedData.tag;
  const serializedEncryptedData = serializeEncryptedData(encryptedData);
  const ciphertextBuffer = serializedEncryptedData.ciphertext;
  const tagBuffer = serializedEncryptedData.tag;
  const ivBuffer = serializedEncryptedData.iv;
  const dataTimestamp = Date.now();
  const ship = anchor.web3.Keypair.fromSeed(new Uint8Array(32).fill(99));
  const program = new anchor.Program(IDL as anchor.Idl, new anchor.AnchorProvider(new Connection("http://127.0.0.1:8899", { commitment: 'confirmed' }), new NodeWallet(ship)));
  const [shipAccountAddress, bump1] = PublicKey.findProgramAddressSync(
    [Buffer.from("ship_account"), ship.publicKey.toBuffer()],
    program.programId
  );

  // @ts-ignore
  const shipAccount = await program.account.shipAccount.fetch(shipAccountAddress);
  const [dataAccount, bump2] = PublicKey.findProgramAddressSync(
    [Buffer.from("data_account"), ship.publicKey.toBuffer(), new anchor.BN(shipAccount.dataAccounts.length - 1, "le").toArrayLike(Buffer, "le", 8)],
    program.programId
  );
  console.log("Ciphertext length: ", ciphertextBuffer.length);
  console.log("Tag length: ", tagBuffer.length);
  console.log("IV length: ", ivBuffer.length);
  console.log("Data timestamp size: ", new anchor.BN(dataTimestamp).toArrayLike(Buffer, "le", 8).length);
  const tx = await program.methods
    .addDataFingerprint(ciphertextBuffer, tagBuffer, ivBuffer, new anchor.BN(dataTimestamp))
    .accountsStrict({
      dataAccount,
      ship: ship.publicKey,
    })
    .signers([ship])
    .rpc();

  console.log("Transaction signature: ", tx);
}

export async function sendToProgramTest(encryptedData) {
  console.log('Sending encrypted data to program: ', encryptedData);

  const ciphertext = encryptedData.ciphertext;
  const tag = encryptedData.tag;
  console.log("TEST1");
  const serializedEncryptedData = serializeEncryptedData(encryptedData);
  console.log("TEST1.5");
  const ciphertextBuffer = serializedEncryptedData.ciphertext;
  const tagBuffer = serializedEncryptedData.tag;
  const ivBuffer = serializedEncryptedData.iv;
  const dataTimestamp = Date.now();
  const ship = anchor.web3.Keypair.fromSeed(new Uint8Array(32).fill(99));
  console.log("TEST2");
  const program = new anchor.Program(IDL as anchor.Idl, new anchor.AnchorProvider(new Connection("http://127.0.0.1:8899", { commitment: 'confirmed' }), new NodeWallet(ship)));
  console.log("TEST3");
  const [shipAccountAddress, bump1] = PublicKey.findProgramAddressSync(
    [Buffer.from("ship_account"), ship.publicKey.toBuffer()],
    program.programId
  );

  // @ts-ignore
  const shipAccount = await program.account.shipAccount.fetch(shipAccountAddress);
  console.log("TEST4");
  const [dataAccount, bump2] = PublicKey.findProgramAddressSync(
    [Buffer.from("data_account"), ship.publicKey.toBuffer(), new anchor.BN(0, "le").toArrayLike(Buffer, "le", 8)],
    program.programId
  );
  console.log("TEST5");
  console.log("Ciphertext length: ", ciphertextBuffer.length);
  console.log("Tag length: ", tagBuffer.length);
  console.log("IV length: ", ivBuffer.length);
  console.log("Data timestamp size: ", new anchor.BN(dataTimestamp).toArrayLike(Buffer, "le", 8).length);
  const tx = await program.methods
    .addDataFingerprint(ciphertextBuffer, tagBuffer, ivBuffer, new anchor.BN(dataTimestamp))
    .accountsStrict({
      dataAccount,
      ship: ship.publicKey,
    })
    .signers([ship])
    .rpc();

  console.log("Transaction signature: ", tx);
}