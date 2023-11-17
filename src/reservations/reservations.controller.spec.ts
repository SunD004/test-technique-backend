import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import {never} from "rxjs";
import {Reservation} from "./reservation.entity";

describe('ReservationsController', () => {
    let controller: ReservationsController;
    let service: ReservationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReservationsController],
            providers: [
                {
                    provide: ReservationsService,
                    useValue: {
                        createReservation: jest.fn(),
                        getReservationById: jest.fn(),
                        updateReservation: jest.fn(),
                        cancelReservation: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get(ReservationsController);
        service = module.get(ReservationsService);
    });

    it('should create a reservation', async () => {
        const dto = new CreateReservationDto();
        jest.spyOn(service, 'createReservation').mockImplementation(async () => new Reservation());
        await controller.create(dto);
        expect(service.createReservation).toHaveBeenCalledWith(dto);
    });


    it('should find a reservation by id', async () => {
        const reservationId = 1;
        const reservation = new Reservation();
        jest.spyOn(service, 'getReservationById').mockResolvedValue(reservation);

        const found = await controller.findOne(reservationId);
        expect(found).toEqual(reservation);
        expect(service.getReservationById).toHaveBeenCalledWith(reservationId);
    });

    it('should update a reservation', async () => {
        const reservationId = 1;
        const updateDto = new UpdateReservationDto();
        const updatedReservation = new Reservation();
        jest.spyOn(service, 'updateReservation').mockResolvedValue(updatedReservation);

        const result = await controller.update(reservationId, updateDto);
        expect(result).toEqual(updatedReservation);
        expect(service.updateReservation).toHaveBeenCalledWith(reservationId, updateDto);
    });

    it('should remove a reservation', async () => {
        const reservationId = 1;
        jest.spyOn(service, 'cancelReservation').mockResolvedValue(undefined);

        await controller.remove(reservationId);
        expect(service.cancelReservation).toHaveBeenCalledWith(reservationId);
    });
});