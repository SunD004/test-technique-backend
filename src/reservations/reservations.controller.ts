import {ReservationsService} from "./reservations.service";
import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    NotFoundException
} from '@nestjs/common';
import { CreateReservationDto, UpdateReservationDto } from './dto';

@Controller('reservations')
export class ReservationsController {
    constructor(private reservationsService: ReservationsService) {
    }

    @Post()
    async create(@Body() createReservationDto: CreateReservationDto) {
        return this.reservationsService.createReservation(createReservationDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        const reservation = await this.reservationsService.getReservationById(id);
        if (!reservation) {
            throw new NotFoundException('Réservation introuvable.');
        }
        return reservation;
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateReservationDto: UpdateReservationDto) {
        return this.reservationsService.updateReservation(id, updateReservationDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.reservationsService.cancelReservation(id);
    }
}
