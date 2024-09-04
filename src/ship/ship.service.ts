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
    // const backupDir = '/var/shipdata/backup/'; //add path

    // if (!fs.existsSync(backupDir)) {
    //   fs.mkdirSync(backupDir, { recursive: true });
    // }

    // const filePath = path.join(backupDir, `backup_${Date.now()}.json`);
    // fs.writeFileSync(filePath, JSON.stringify({ ...createShipDto, timestamp: new Date() }));

    return (await this.shipRepository.create(createShipDto)).toObject();
  }

  @Cron('* * * * *')
  async fetchSensorData() {
    const enums = Object.keys(CargoStatus);

    const temp = await this.findOne(1);

    const currentCountryIndex = countries.indexOf(
      temp.seaState[temp.seaState.length - 1],
    );

    const updateShipDto: UpdateShipDto = {
      gpsLocation: Math.random() * 100,
      //mileage should be greater than last, max by 10km every minute
      mileage:
        temp.mileage[temp.mileage.length - 1] + Math.floor(Math.random() * 10),
      //TODO
      //engine load can change max -5% to 5% every minute
      engineLoad:
        temp.engineLoad[temp.engineLoad.length - 1] +
        Math.floor(Math.random() * 11) -
        5,
      //fuel level should be lower max 2% every minute
      fuelLevel:
        temp.fuelLevel[temp.fuelLevel.length - 1] -
        Math.floor(Math.random() * 2),
      //country is changed every minute to next in array of countries
      seaState: countries[(currentCountryIndex + 1) % countries.length],
      //sea surface temperature can change max -2 to +2 every minute
      seaSurfaceTemperature:
        temp.seaSurfaceTemperature[temp.seaSurfaceTemperature.length - 1] +
        Math.floor(Math.random() * 5) -
        2,
      //air temperature can change max -2 to +2 every minute
      airTemperature:
        temp.airTemperature[temp.airTemperature.length - 1] +
        Math.floor(Math.random() * 5) -
        2,
      //humidity can change max -2% to +2% every minute
      humidity:
        temp.humidity[temp.humidity.length - 1] +
        Math.floor(Math.random() * 5) -
        2,
      //barometric pressure can change max -5 to 5 every minute
      barometricPressure:
        temp.barometricPressure[temp.barometricPressure.length - 1] +
        Math.floor(Math.random() * 11) -
        5,
      //TODO
      //cargo status changes every minute
      cargoStatus: CargoStatus[enums[Math.floor(Math.random() * enums.length)]],
    };

    console.log(updateShipDto);

    await this.shipRepository.update(1, updateShipDto);
  }

  async findOne(shipID: number): Promise<Ship> {
    return await this.shipRepository.findOne(shipID);
  }

  async findAll(): Promise<Ship[]> {
    return await this.shipRepository.findAll();
  }

  async update(shipID: number, updateShipDto: UpdateShipDto) {
    // const backupDir = '/shipdata/backup/'; //add path

    // if (!fs.existsSync(backupDir)) {
    //   fs.mkdirSync(backupDir, { recursive: true });
    // }

    // const filePath = path.join(backupDir, `backup_${Date.now()}.json`);
    // fs.writeFileSync(filePath, JSON.stringify({ ...updateShipDto, shipID, timestamp: new Date() }));

    return await this.shipRepository.update(shipID, updateShipDto);
  }

  remove(id: number) {
    return `This action removes a #${id} ship`;
  }
}
