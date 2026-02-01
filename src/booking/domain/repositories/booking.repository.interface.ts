import { Booking } from '../entities/booking.entity';

export interface IBookingRepository {
  save(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
}
