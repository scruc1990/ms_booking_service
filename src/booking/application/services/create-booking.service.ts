import { Injectable, Inject } from '@nestjs/common';
import * as Type from '../../domain/repositories/booking.repository.interface';
import { CreateBookingDto } from 'src/booking/infrastructure/controllers/dtos/create-booking.dto';
import { Booking, BookingStatus } from '../../domain/entities/booking.entity';
import { v4 as uuidv4 } from 'uuid';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CreateBookingService {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: Type.IBookingRepository,
    @Inject('PAYMENT_SERVICE') private readonly client: ClientProxy,
  ) {}

  async execute(
    dto: CreateBookingDto,
    userId: string,
    idempotencyKey: string,
  ): Promise<Booking | null> {
    const uuid = uuidv4() as unknown as string;
    const booking = new Booking(
      uuid,
      userId,
      dto.flightId,
      dto.price,
      BookingStatus.PENDING,
    );

    await this.bookingRepository.save(booking);
    console.log('Reserva guardada en BD local');

    this.client.emit('booking_created', {
      bookingId: booking.id,
      amount: booking.price,
      userId,
      idempotencyKey,
    });

    return booking;
  }
}
