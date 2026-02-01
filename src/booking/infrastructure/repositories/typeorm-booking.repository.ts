import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IBookingRepository } from '../../domain/repositories/booking.repository.interface';
import { Booking } from '../../domain/entities/booking.entity';

@Injectable()
export class TypeOrmBookingRepository implements IBookingRepository {
  constructor(
    @InjectRepository(Booking)
    private readonly ormRepository: Repository<Booking>,
  ) {}

  async save(booking: Partial<Booking>): Promise<Booking> {
    return await this.ormRepository.save(booking);
  }

  async findById(id: string): Promise<Booking | null> {
    return await this.ormRepository.findOne({ where: { id } });
  }
}
