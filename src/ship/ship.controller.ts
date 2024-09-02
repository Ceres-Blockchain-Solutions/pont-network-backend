import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ShipService } from './ship.service';
import { CreateShipDto } from './dto/create-ship.dto';
import { UpdateShipDto } from './dto/update-ship.dto';

@ApiTags('Ship')
@Controller('ship')
export class ShipController {
  constructor(private readonly shipService: ShipService) {}

  @Post()
  create(@Body() createShipDto: CreateShipDto) {
    return this.shipService.create(createShipDto);
  }

  @Get()
  findAll() {
    return this.shipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.shipService.findOne(id);
  }

  @Patch(':shipID')
  update(
    @Param('shipID') shipID: number,
    @Body() updateShipDto: UpdateShipDto,
  ) {
    return this.shipService.update(shipID, updateShipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shipService.remove(+id);
  }
}
