import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ReservationsModule} from './reservations/reservations.module';
import {Reservation} from "./reservations/reservation.entity";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db/db.sqlite',
            entities: [Reservation],
            synchronize: true,
        }),
        ReservationsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
