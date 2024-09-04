import { Injectable } from '@nestjs/common';
import { CargoStatus, CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';
import { ShipRepository } from './repository/ship.repository';
import { Ship } from './entities/ship.entity';
import { Cron } from '@nestjs/schedule';

import { Coordinate } from './entities/ship.entity';


import * as fs from 'fs';
import * as path from 'path';

const filePath = path.resolve(__dirname, 'utils/country-names.json');
const countries = JSON.parse(
  fs.readFileSync(filePath.replace('dist', 'src'), 'utf-8'),
);

@Injectable()
export class ShipService {
  constructor(private readonly shipRepository: ShipRepository) {}

  private mileage = 0; // Initialize mileage
  private fuelLevel = 100; // Initialize fuel level to 100 (full)

  async create(createShipDto: CreateShipDto) {
    return (await this.shipRepository.create(createShipDto)).toObject();
  }

  @Cron('* * * * *')
  async fetchSensorData() {
    const enums = Object.keys(CargoStatus);

    // Generate random values for each field except mileage and fuel level
    const gpsLocation = {
      latitude: this.randomFloatInRange(-90, 90), // Latitude range -90 to 90
      longitude: this.randomFloatInRange(-180, 180), // Longitude range -180 to 180
    };

    // Increment mileage and decrement fuel level
    this.mileage += this.randomFloatInRange(0.1, 2.0); // Increment mileage by a small random value
    this.fuelLevel -= this.randomFloatInRange(0.1, 1.0); // Decrement fuel level by a small random value
    if (this.fuelLevel < 0) this.fuelLevel = 0; // Ensure fuel level doesn't go negative    

    const createShipDto: CreateShipDto = {
      shipID: 1,
      gpsLocation,
      mileage: this.mileage,
      engineLoad: this.randomFloatInRange(10, 100),
      fuelLevel: this.fuelLevel,
      seaState: this.randomSeaState(),
      seaSurfaceTemperature: this.randomFloatInRange(5, 30),
      airTemperature: this.randomFloatInRange(-10, 40),
      humidity: this.randomFloatInRange(30, 100),
      barometricPressure: this.randomFloatInRange(950, 1050),
      cargoStatus: CargoStatus[enums[Math.floor(Math.random() * enums.length)]],
    };

    console.log(createShipDto);

    return (await this.shipRepository.create(createShipDto)).toObject();
  }

  // Helper function to generate a random float within a range
  private randomFloatInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // Helper function to generate a random sea state
  private randomSeaState(): string {
    const states = ['calm', 'slight', 'moderate', 'rough', 'very rough', 'high', 'very high', 'phenomenal'];
    return states[Math.floor(Math.random() * states.length)];
  }

  async findAllByID(shipID: number): Promise<Ship[]> {
    return await this.shipRepository.findAllByID(shipID);
  }

  async findAll(): Promise<Ship[]> {
    return await this.shipRepository.findAll();
  }

}
