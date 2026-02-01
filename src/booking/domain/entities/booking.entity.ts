import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

export enum BookingStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('bookings')
export class Booking {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  flightId: string;

  @Column('decimal')
  price: number;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @CreateDateColumn()
  createdAt: Date;

  constructor(
    id: string,
    userId: string,
    flightId: string,
    price: number,
    status: BookingStatus = BookingStatus.PENDING,
  ) {
    this.id = id;
    this.userId = userId;
    this.flightId = flightId;
    this.price = price;
    this.status = status;
  }

  getStatus(): BookingStatus {
    return this.status;
  }

  setStatus(status: BookingStatus) {
    this.status = status;
  }

  confirm() {
    if (this.status === BookingStatus.CANCELLED) {
      throw new Error('No se puede confirmar una reserva cancelada');
    }
    this.status = BookingStatus.COMPLETED;
  }

  cancel() {
    this.status = BookingStatus.CANCELLED;
  }
}
