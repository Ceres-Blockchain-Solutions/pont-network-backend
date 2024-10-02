import { CargoStatus } from '../../dto/create-ship.dto';

export const currentShip = {
  id: '2kBcbo8q4m2BQHBM6YXdqzKvs3jngDKeuasLUbjpzLbw',
  gps: {
    lat: 0,
    long: 0,
  },
  mil: 0,
  eng: 4,
  fuel: 100,
  sea: 'calm',
  sst: 10,
  air: 25,
  hum: 60,
  bar: 1000,
  cargo: CargoStatus[0],
  time: Date.now(),
};
