import { Injectable } from '@nestjs/common';
import { CargoStatus, CreateShipDto } from './dto/create-ship.dto';
import { ShipRepository } from './repository/ship.repository';
import { Ship } from './entities/ship.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as Bull from 'bull';


@Injectable()
export class ShipService {
  constructor(private readonly shipRepository: ShipRepository) {}

  private mileage = 0; // Initialize mileage
  private fuelLevel = 100; // Initialize fuel level to 100 (full)
  private shipQueue = [];

  async create(createShipDto: CreateShipDto) {
    this.mileage = createShipDto.mileage;
    return (await this.shipRepository.create(createShipDto)).toObject();
  }

  // @Cron(CronExpression.EVERY_10_MINUTES)
  @Cron(CronExpression.EVERY_5_SECONDS)
  async fetchSensorData() {
    const enums = Object.keys(CargoStatus);

    const temp = await this.shipRepository.findAllByID(
      '2kBcbo8q4m2BQHBM6YXdqzKvs3jngDKeuasLUbjpzLbw',
    );
    const lastShipData = temp[temp.length - 1];
    // Generate random values for each field except mileage and fuel level
    const gpsLocation = {
      latitude: this.randomFloatInRange(
        lastShipData.gpsLocation.latitude - 5,
        lastShipData.gpsLocation.latitude + 5,
      ), // Latitude range -90 to 90
      longitude: this.randomFloatInRange(
        lastShipData.gpsLocation.longitude - 5,
        lastShipData.gpsLocation.longitude + 5,
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
        lastShipData.seaSurfaceTemperature - 2,
        lastShipData.seaSurfaceTemperature + 2,
      ),
      airTemperature: this.randomFloatInRange(
        lastShipData.airTemperature - 2,
        lastShipData.airTemperature + 2,
      ),
      humidity: this.randomFloatInRange(
        lastShipData.humidity - 2,
        lastShipData.humidity + 2,
      ),
      barometricPressure: this.randomFloatInRange(
        lastShipData.barometricPressure - 2,
        lastShipData.barometricPressure + 2,
      ),
      cargoStatus: CargoStatus[enums[Math.floor(Math.random() * enums.length)]],
    };

    // add condition
    if (this.shipQueue.length < 5) {
      this.shipQueue.push({ ...createShipDto, timestamp: new Date() });
    } else {
      await Promise.all(
        this.shipQueue.map(async ({ timestamp, ...createShipDto }) => {
          // Send element to program on Solana
          await this.sendToProgram(createShipDto);
      
          return (await this.shipRepository.create(createShipDto)).toObject();
        })
      );

      this.shipQueue = [];
    }
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

    return "bre"
  }

  async findAllByID(shipID: string): Promise<Ship[]> {
    return await this.shipRepository.findAllByID(shipID);
  }

  async findAll(): Promise<Ship[]> {
    return await this.shipRepository.findAll();
  }
}
