import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShipService } from './ship.service';
import { CreateShipDto } from './dto/create-ship.dto';

@ApiTags('Ship')
@Controller('ship')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @Post('/create-ship')
  create(@Body() createShipDto: CreateShipDto) {
    return this.shipService.create(createShipDto);
  }

  @Get('/get-all-ships')
  findAll() {
    return this.shipService.findAll();
  }

  @Get(':shipID')
  findAllByID(@Param('shipID') shipID: string) {
    return this.shipService.findAllByID(shipID);
  }
}
