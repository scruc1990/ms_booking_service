import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  readonly flightId: string;

  @IsString()
  readonly seatNumber: string;

  @IsNumber()
  @Min(0)
  readonly price: number;
}
