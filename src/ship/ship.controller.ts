import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShipService } from './ship.service';
import { ShipDataEncryptedDto } from './dto/create-ship-encrypted.dto';

@ApiTags('Ship')
@Controller('ship')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @Post('/create-ship')
  create(@Body() shipDataEncryptedDto: ShipDataEncryptedDto) {
    return this.shipService.create(shipDataEncryptedDto);
  }

  @Post('/create-initial-decrypted-ships')
  createDecryptedShip() {
    return this.shipService.createDecryptedShip();
  }

  @Get('/get-all-ships')
  findAll() {
    return this.shipService.findAll();
  }

  @Get('/get-all-ships-decrypted')
  findAllDecrypted() {
    return this.shipService.findAllDecrypted();
  }

  @Get(':shipID')
  findAllByID(@Param('shipID') shipID: string) {
    return this.shipService.findAllByID(shipID);
  }
}
