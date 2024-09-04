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

  async create(createShipDto: CreateShipDto) {
    return (await this.shipRepository.create(createShipDto)).toObject();
  }

  @Cron('* * * * *')
  async fetchSensorData() {
    const enums = Object.keys(CargoStatus);

    const createShipDto: CreateShipDto = {
      shipID: 1,
      gpsLocation: {
        latitude: 1,
        longitude: 2,
      },
      mileage: 4,
      engineLoad: 100,
      fuelLevel: 2,
      seaState: 'mokro',
      seaSurfaceTemperature: 20,
      airTemperature: 20,
      humidity: 3,
      barometricPressure: 2,
      cargoStatus: CargoStatus[enums[0]],
    };

    return (await this.shipRepository.create(createShipDto)).toObject();
  }

  async findAllByID(shipID: number): Promise<Ship[]> {
    return await this.shipRepository.findAllByID(shipID);
  }

  async findAll(): Promise<Ship[]> {
    return await this.shipRepository.findAll();
  }

}
