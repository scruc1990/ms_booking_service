import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CreateBookingService } from './booking/application/services/create-booking.service';
import { BookingController } from './booking/infrastructure/controllers/booking.controller';
import { RedisModule } from '@nestjs-modules/ioredis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmBookingRepository } from './booking/infrastructure/repositories/typeorm-booking.repository';
import { Booking } from './booking/domain/entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '[PASSWORD]',
      database: 'booking_db',
      autoLoadEntities: true, // Carga automáticamente las entidades que definamos
      synchronize: true, // ¡Solo para desarrollo! Crea las tablas automáticamente
    }),
    TypeOrmModule.forFeature([Booking]),
    RedisModule.forRoot({
      type: 'single',
      options: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'payments_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [
    CreateBookingService,
    {
      provide: 'IBookingRepository',
      useClass: TypeOrmBookingRepository,
    },
  ],
})
export class AppModule {}
