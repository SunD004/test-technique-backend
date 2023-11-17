import {Test, TestingModule} from '@nestjs/testing';
import {ReservationsService} from './reservations.service';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Reservation} from './reservation.entity';
import {Repository} from 'typeorm';
import {BadRequestException} from "@nestjs/common";
import {ReservationsController} from "./reservations.controller";

export const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
};

describe('ReservationsService', () => {
    let service: ReservationsService;
    let repository: Repository<Reservation>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ReservationsController],
            providers: [
                ReservationsService,
                {
                    provide: getRepositoryToken(Reservation),
                    useValue: mockRepository,
                },
            ],
        }).compile();


        service = module.get(ReservationsService);
        repository = module.get(getRepositoryToken(Reservation));
    });

    describe('createReservation', () => {
        it('should throw an error if startDate is after endDate', async () => {
            const createReservationDto = {
                vehicleId: 'v123',
                startDate: new Date('2023-12-12'),
                endDate: new Date('2023-12-10'),
            };

            await expect(service.createReservation(createReservationDto)).rejects.toThrow(BadRequestException);
        });
    });

    describe('isVehicleAvailable', () => {
        it('should return true if no conflicting reservations are found', async () => {
            mockRepository.findOne.mockResolvedValueOnce(null);
            const availability = await service.isVehicleAvailable('v123', new Date('2023-12-01'), new Date('2023-12-10'));
            expect(availability).toBe(true);
        });
    });
});