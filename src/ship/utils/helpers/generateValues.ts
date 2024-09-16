import { CargoStatus, CreateShipDto } from "src/ship/dto/create-ship.dto";

import * as crypto from 'crypto';
import * as cbor from 'cbor';

export async function encrypt(plaintext, key, iv) {
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

  return createShipDto;
}

export async function encryptShip(createShipDto: CreateShipDto): Promise<string> {
  const serialized = cbor.encode(createShipDto);
  const data = Buffer.from(serialized);

  const iv = new Uint32Array(3);
  crypto.getRandomValues(iv);
  const masterKey = new Uint32Array(8);
  crypto.getRandomValues(masterKey);

  const encryptedData = this.encrypt(data, masterKey, iv);

  return encryptedData.ciphertext;
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