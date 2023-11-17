import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {LessThanOrEqual, MoreThanOrEqual, Repository} from "typeorm";
import {Reservation} from "./reservation.entity";
import {InjectRepository} from "@nestjs/typeorm";

import {CreateReservationDto, UpdateReservationDto} from './dto';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
    ) {
    }

    private validateDates(startDate: Date, endDate: Date): void {
        if (startDate >= endDate) {
            throw new BadRequestException('La date de début doit être antérieure à la date de fin.');
        }
    }

    async isVehicleAvailable(vehicleId: string, startDate: Date, endDate: Date): Promise<boolean> {
        const conflictingReservation = await this.reservationRepository.findOne({
            where: {
                vehicleId,
                startDate: LessThanOrEqual(endDate),
                endDate: MoreThanOrEqual(startDate),
            },
        });
        return !conflictingReservation;
    }

    async createReservation(createReservationDto: CreateReservationDto): Promise<Reservation> {
        const {vehicleId, startDate, endDate} = createReservationDto;

        this.validateDates(startDate, endDate)
        if (!(await this.isVehicleAvailable(vehicleId, startDate, endDate))) {
            throw new ConflictException('Ce véhicule n\'est pas disponible pendant les dates sélectionnées.');
        }

        const reservation = this.reservationRepository.create(createReservationDto);
        return this.reservationRepository.save(reservation);
    }

    async updateReservation(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
        const reservation = await this.reservationRepository.findOne({
            where: {id}
        });
        if (!reservation) {
            throw new NotFoundException('Réservation introuvable.');
        }

        const {vehicleId, startDate, endDate} = updateReservationDto;

        this.validateDates(startDate, endDate)
        if (!(await this.isVehicleAvailable(vehicleId, startDate, endDate))) {
            throw new ConflictException('Ce véhicule n\'est pas disponible pendant les nouvelles dates sélectionnées.');
        }
        Object.assign(reservation, updateReservationDto);
        return this.reservationRepository.save(reservation);
    }

    async cancelReservation(id: number): Promise<{ message: string }> {
        const result = await this.reservationRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Réservation introuvable.');
        }
        return {message: 'Réservation annulée avec succès.'};
    }

    async getReservationById(id: number): Promise<Reservation> {
        const reservation = await this.reservationRepository.findOne({
            where: {id}
        });
        if (!reservation) {
            throw new NotFoundException(`Réservation avec l'identifiant ${id} non trouvée.`);
        }
        return reservation;
    }
}
