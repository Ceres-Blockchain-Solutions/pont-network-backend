import { CargoStatus } from '../dto/create-ship.dto';

export const currentShip = {
  shipID: '2kBcbo8q4m2BQHBM6YXdqzKvs3jngDKeuasLUbjpzLbw',
  gpsLocation: {
    latitude: 0,
    longitude: 0,
  },
  mileage: 0,
  engineLoad: 4,
  fuelLevel: 100,
  seaState: 'calm',
  seaSurfaceTemperature: 10,
  airTemperature: 25,
  humidity: 60,
  barometricPressure: 1000,
  cargoStatus: CargoStatus[0],
  timestamp: 1725629183002,
};
