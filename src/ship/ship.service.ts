import { Injectable } from '@nestjs/common';
import { CargoStatus, CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';
import { ShipRepository } from './repository/ship.repository';
import { Ship } from './entities/ship.entity';
import { Cron } from '@nestjs/schedule';

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

  @Cron('45 * * * * *')
  async fetchSensorData() {
    const enums = Object.keys(CargoStatus);

    const updateShipDto: UpdateShipDto = {
      gpsLocation: Math.random() * 100,
      mileage: Math.random() * 100,
      engineLoad: Math.random() * 100,
      fuelLevel: Math.random() * 100,
      seaState: countries[Math.floor(Math.random() * countries.length)],
      seaSurfaceTemperature: Math.random() * 100,
      airTemperature: Math.random() * 100,
      humidity: Math.random() * 100,
      barometricPressure: Math.random() * 100,
      cargoStatus: CargoStatus[enums[Math.floor(Math.random() * enums.length)]],
    };

    console.log(updateShipDto);

    await this.shipRepository.update(1, updateShipDto);
  }

  async findAll(): Promise<Ship[]> {
    return await this.shipRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} ship`;
  }

  async update(shipID: number, updateShipDto: UpdateShipDto) {
    return await this.shipRepository.update(shipID, updateShipDto);
    // return `This action updates a #${id} ship`;
  }

  remove(id: number) {
    return `This action removes a #${id} ship`;
  }
}
