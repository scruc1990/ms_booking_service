import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CreateBookingService } from './booking/application/services/create-booking.service';
import { BookingController } from './booking/infrastructure/controllers/booking.controller';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
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
  providers: [CreateBookingService],
})
export class AppModule {}
