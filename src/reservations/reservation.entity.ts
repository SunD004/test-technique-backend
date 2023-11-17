import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    vehicleId: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;
}