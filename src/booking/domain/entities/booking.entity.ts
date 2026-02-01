export enum BookingStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class Booking {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly flightId: string,
    public readonly price: number,
    private _status: BookingStatus = BookingStatus.PENDING,
  ) {}

  get status(): BookingStatus {
    return this._status;
  }

  set status(status: BookingStatus) {
    this._status = status;
  }

  confirm() {
    if (this._status === BookingStatus.CANCELLED) {
      throw new Error('No se puede confirmar una reserva cancelada');
    }
    this._status = BookingStatus.COMPLETED;
  }

  cancel() {
    this._status = BookingStatus.CANCELLED;
  }
}
